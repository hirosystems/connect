import { JsonRpcResponse, MethodParams, Methods } from '../methods';

export interface StacksProvider {
  request<M extends keyof Methods>(
    method: M,
    params?: MethodParams<M>
  ): Promise<JsonRpcResponse<M>>;
}
