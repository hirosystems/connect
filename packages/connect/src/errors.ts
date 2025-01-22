import { JsonRpcResponseError } from './methods';

export class JsonRpcError extends Error {
  constructor(
    public message: string,
    public code: number,
    public data?: string,

    public cause?: Error
  ) {
    super(message);
    this.name = 'JsonRpcError';
    this.message = message;
    this.code = code;
    this.data = data;

    this.cause = cause;
  }

  static fromResponse(error: JsonRpcResponseError) {
    return new JsonRpcError(error.message, error.code, error.data);
  }

  toString() {
    return `${this.name} (${this.code}): ${this.message}${this.data ? `: ${JSON.stringify(this.data)}` : ''}`;
  }
}

/**
 * Numeric error codes for JSON-RPC errors, used for `.code` in {@link JsonRpcError}.
 * Implementation-defined wallet errors range from `-32099` to `-32000`.
 */
export enum JsonRpcErrorCode {
  // https://www.jsonrpc.org/specification#error_object
  // > The error codes from and including -32768 to -32000 are reserved for pre-defined errors.

  /** Invalid JSON received by server while parsing */
  ParseError = -32_700,

  /** Invalid Request object */
  InvalidRequest = -32_600,

  /** Method not found/available */
  MethodNotFound = -32_601,

  /** Invalid method params */
  InvalidParams = -32_602,

  /** Internal JSON-RPC error */
  InternalError = -32_603,

  // IMPLEMENTATION-DEFINED WALLET ERRORS
  /** User rejected the request (implementation-defined wallet error) */
  UserRejection = -32_000,

  /** Address mismatch for the requested method (implementation-defined wallet error) */
  MethodAddressMismatch = -32_001,

  /** Access denied for the requested method (implementation-defined wallet error) */
  MethodAccessDenied = -32_002,

  // CUSTOM ERRORS (Custom range, not inside the JSON-RPC error code range)
  /**
   * Unknown external error.
   * Error does not originate from the wallet.
   */
  UnknownError = -31_000,

  /**
   * User canceled the request.
   * Error may not originate from the wallet.
   */
  UserCanceled = -31_001,
}
