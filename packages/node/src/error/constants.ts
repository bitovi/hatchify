export enum codes {
  ERR_CONFLICT = "resource-conflict-occurred",
  ERR_INVALID_PARAMETER = "invalid-parameter",
  ERR_NOT_FOUND = "not-found",
  ERR_DATABASE_ERROR = "database-error",
  ERR_SERVER_ERROR = "server-error",
  ERR_VALUE_REQUIRED = "value-required",
  ERR_UNEXPECTED_VALUE = "unexpected-value",
  ERR_RELATIONSHIP_PATH = "relationship-path",
}

export enum statusCodes {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}
