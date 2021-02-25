import { PreapplyResponse, RPCRunOperationParam, OpKind, OperationContents } from '@taquito/rpc';
import BigNumber from 'bignumber.js';
import { flattenErrors, TezosOperationError } from '../operations/operation-errors';
import { PrepareOperationParams } from '../operations/types';
import { OperationEmitter } from '../operations/operation-emitter';

export const mergeLimits = (
  userDefinedLimit: Limits,
  defaultLimits: Required<Limits>
): Required<Limits> => {
  return {
    fee: typeof userDefinedLimit.fee === 'undefined' ? defaultLimits.fee : userDefinedLimit.fee,
    gasLimit:
      typeof userDefinedLimit.gasLimit === 'undefined'
        ? defaultLimits.gasLimit
        : userDefinedLimit.gasLimit,
    storageLimit:
      typeof userDefinedLimit.storageLimit === 'undefined'
        ? defaultLimits.storageLimit
        : userDefinedLimit.storageLimit,
  };
};

export interface Limits {
  fee?: number;
  storageLimit?: number;
  gasLimit?: number;
}

export const SIGNATURE_STUB =
  'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg';

export abstract class PreaplyEmitter extends OperationEmitter {
  protected readonly ALLOCATION_STORAGE = 257;
  protected readonly ORIGINATION_STORAGE = 257;

  // Maximum values defined by the protocol
  protected async getAccountLimits(pkh: string) {
    const balance = await this.rpc.getBalance(pkh);
    const {
      hard_gas_limit_per_operation,
      hard_storage_limit_per_operation,
      cost_per_byte,
    } = await this.rpc.getConstants();
    return {
      fee: 0,
      gasLimit: hard_gas_limit_per_operation.toNumber(),
      storageLimit: Math.floor(
        BigNumber.min(balance.dividedBy(cost_per_byte), hard_storage_limit_per_operation).toNumber()
      ),
    };
  }

  protected async createOperationParams(branch: string, contents: OperationContents[]) {
    let operation: RPCRunOperationParam = {
      operation: { branch, contents, signature: SIGNATURE_STUB },
      chain_id: await this.rpc.getChainId(),
    };

    return operation;
  }

  protected async preaplyOperation(operation: RPCRunOperationParam) {
    const { opResponse } = await this.simulate(operation);
    const errors = [...flattenErrors(opResponse, 'backtracked'), ...flattenErrors(opResponse)];

    // Fail early in case of errors
    if (errors.length) {
      throw new TezosOperationError(errors);
    }

    return opResponse;
  }

  protected async makeOperation(params: PrepareOperationParams) {
    const {
      opOb: { branch, contents },
    } = await this.prepareAndForge(params);

    let operation = await this.createOperationParams(branch, contents);

    const transactions = await this.preaplyOperation(operation);

    return transactions;
  }
}
