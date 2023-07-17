export enum codes {
  ERR_PARAMETER_REQUIRED = "parameter-required",
  ERR_CONFLICT = "resource-conflict-occurred",
  ERR_RANGE = "range-error",
  ERR_INVALID_PARAMETER = "invalid-parameter",
  ERR_DUPLICATE_PARAMETER = "duplicate-parameter",
  ERR_NO_RESULTS_FOUND = "no-results-found",
  ERR_NOT_FOUND = "not-found",
  ERR_DATABASE_ERROR = "database-error",
  ERR_INVALID_RESULT = "invalid-result",
  ERR_SERVER_ERROR = "server-error",
  ERR_VALUE_REQUIRED = "value-required",
  ERR_UNEXPECTED_VALUE = "unexpected-value",
}

export enum statusCodes {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}
