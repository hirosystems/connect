import { JsonRpcResponse, MethodParamsRaw, MethodsRaw } from '../methods';

export interface StacksProvider {
  request<M extends keyof MethodsRaw>(
    method: M,
    params?: MethodParamsRaw<M>
  ): Promise<JsonRpcResponse<M>>;
}
