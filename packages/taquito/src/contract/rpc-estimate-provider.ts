import { PreapplyResponse, RPCRunOperationParam, OpKind } from '@taquito/rpc';
import BigNumber from 'bignumber.js';
import { flattenOperationResult } from '../operations/operation-errors';
import {
  DelegateParams,
  isOpWithFee,
  OriginateParams,
  ParamsWithKind,
  PrepareOperationParams,
  RegisterDelegateParams,
  RPCOperation,
  TransferParams,
} from '../operations/types';
import { Estimate } from './estimate';
import { EstimationProvider } from './interface';
import {
  createOriginationOperation,
  createRegisterDelegateOperation,
  createSetDelegateOperation,
  createTransferOperation,
} from './prepare';
import { PreaplyEmitter, mergeLimits, SIGNATURE_STUB } from '../operations/preaply-emitter';

export class RPCEstimateProvider extends PreaplyEmitter implements EstimationProvider {
  private createEstimateFromOperationContent(
    content: PreapplyResponse['contents'][0],
    size: number,
    costPerByte: BigNumber
  ) {
    const operationResults = flattenOperationResult({ contents: [content] });
    let totalGas = 0;
    let totalMilligas = 0;
    let totalStorage = 0;
    operationResults.forEach((result) => {
      totalStorage +=
        'originated_contracts' in result && typeof result.originated_contracts !== 'undefined'
          ? result.originated_contracts.length * this.ORIGINATION_STORAGE
          : 0;
      totalStorage += 'allocated_destination_contract' in result ? this.ALLOCATION_STORAGE : 0;
      totalGas += Number(result.consumed_gas) || 0;
      totalMilligas += Number(result.consumed_milligas) || 0;
      totalStorage +=
        'paid_storage_size_diff' in result ? Number(result.paid_storage_size_diff) || 0 : 0;
    });

    if (totalGas !== 0 && totalMilligas === 0) {
      // This will convert gas to milligas for Carthagenet where result does not contain consumed gas in milligas.
      totalMilligas = totalGas * 1000;
    }

    if (isOpWithFee(content)) {
      return new Estimate(
        totalMilligas || 0,
        Number(totalStorage || 0),
        size,
        costPerByte.toNumber()
      );
    } else {
      return new Estimate(0, 0, size, costPerByte.toNumber(), 0);
    }
  }

  private async createEstimate(params: PrepareOperationParams) {
    const {
      opbytes,
      opOb: { branch, contents },
    } = await this.prepareAndForge(params);

    let operation = await this.createOperationParams(branch, contents);

    const transactions = await this.preaplyOperation(operation);

    const { cost_per_byte } = await this.rpc.getConstants();

    while (
      transactions.contents.length !==
      (Array.isArray(params.operation) ? params.operation.length : 1)
    ) {
      transactions.contents.shift();
    }

    return transactions.contents.map((x) => {
      return this.createEstimateFromOperationContent(
        x,
        opbytes.length / 2 / transactions.contents.length,
        cost_per_byte
      );
    });
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for an origination operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param OriginationOperation Originate operation parameter
   */
  async originate({ fee, storageLimit, gasLimit, ...rest }: OriginateParams) {
    const pkh = await this.signer.publicKeyHash();
    const DEFAULT_PARAMS = await this.getAccountLimits(pkh);
    const op = await createOriginationOperation(
      await this.context.parser.prepareCodeOrigination({
        ...rest,
        ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
      })
    );
    const transactions = await this.createEstimate({ operation: op, source: pkh });
    return transactions[0];
  }
  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for an transfer operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param TransferOperation Originate operation parameter
   */
  async transfer({ fee, storageLimit, gasLimit, ...rest }: TransferParams) {
    const pkh = await this.signer.publicKeyHash();
    const DEFAULT_PARAMS = await this.getAccountLimits(pkh);
    const op = await createTransferOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });
    const transactions = await this.createEstimate({ operation: op, source: pkh });
    return transactions[0];
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for a delegate operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  async setDelegate({ fee, gasLimit, storageLimit, ...rest }: DelegateParams) {
    const sourceOrDefault = rest.source || (await this.signer.publicKeyHash());
    const DEFAULT_PARAMS = await this.getAccountLimits(sourceOrDefault);
    const op = await createSetDelegateOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });

    const transactions = await this.createEstimate({ operation: op, source: sourceOrDefault });
    return transactions[0];
  }

  async batch(params: ParamsWithKind[]) {
    const operations: RPCOperation[] = [];
    const DEFAULT_PARAMS = await this.getAccountLimits(await this.signer.publicKeyHash());
    for (const param of params) {
      switch (param.kind) {
        case OpKind.TRANSACTION:
          operations.push(
            await createTransferOperation({
              ...param,
              ...mergeLimits(param, DEFAULT_PARAMS),
            })
          );
          break;
        case OpKind.ORIGINATION:
          operations.push(
            await createOriginationOperation({
              ...param,
              ...mergeLimits(param, DEFAULT_PARAMS),
            })
          );
          break;
        case OpKind.DELEGATION:
          operations.push(
            await createSetDelegateOperation({
              ...param,
              ...mergeLimits(param, DEFAULT_PARAMS),
            })
          );
          break;
        case OpKind.ACTIVATION:
          operations.push({
            ...param,
            ...DEFAULT_PARAMS,
          });
          break;
        default:
          throw new Error(`Unsupported operation kind: ${(param as any).kind}`);
      }
    }

    const transactions = await this.createEstimate({ operation: operations });
    return transactions;
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for a delegate operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  async registerDelegate(params: RegisterDelegateParams) {
    const DEFAULT_PARAMS = await this.getAccountLimits(await this.signer.publicKeyHash());
    const op = await createRegisterDelegateOperation(
      { ...params, ...DEFAULT_PARAMS },
      await this.signer.publicKeyHash()
    );
    return (
      await this.createEstimate({ operation: op, source: await this.signer.publicKeyHash() })
    )[0];
  }
}
