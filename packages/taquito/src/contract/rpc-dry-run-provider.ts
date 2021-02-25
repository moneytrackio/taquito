import { OpKind } from '@taquito/rpc';
import {
  DelegateParams,
  OriginateParams,
  ParamsWithKind,
  RegisterDelegateParams,
  RPCOperation,
  TransferParams,
} from '../operations/types';
import { DryRunProvider } from './interface';
import {
  createOriginationOperation,
  createRegisterDelegateOperation,
  createSetDelegateOperation,
  createTransferOperation,
} from './prepare';
import { PreaplyEmitter, mergeLimits } from '../operations/preaply-emitter';

export class RPCDryRunProvider extends PreaplyEmitter implements DryRunProvider {
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
    const transaction = await this.makeOperation({ operation: op, source: pkh });
    return transaction;
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

    const transaction = await this.makeOperation({ operation: op, source: pkh });
    return transaction;
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
    const transaction = await this.makeOperation({ operation: op, source: sourceOrDefault });
    return transaction;
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

    const transaction = await this.makeOperation({ operation: operations });
    return transaction;
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
    const trasactions = await this.makeOperation({
      operation: op,
      source: await this.signer.publicKeyHash(),
    });
    return trasactions;
  }
}
