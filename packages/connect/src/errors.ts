export class JsonRpcError extends Error {
  constructor(
    message: string,
    public code: number,
    public data?: string,
    public cause?: Error
  ) {
    super(data ? `${message} (${data})` : message);
    this.name = 'JsonRpcError';
    this.cause = cause;
  }
}

export class ConnectCanceledError extends JsonRpcError {
  constructor(message = 'User canceled provider selection') {
    super(message, ConnectErrorCode.Canceled);
    this.name = 'ConnectCanceledError';
  }
}

export enum ConnectErrorCode {
  Canceled = 32_001,
}

export enum JsonRpcErrorCode {
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

  /** Implementation-defined server errors (-32_000 to -32_099) */
  ServerError = -32_000,
}
