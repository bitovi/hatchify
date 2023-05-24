import { codes, statusCodes } from "./constants";

class Source {
  pointer: string;
  parameter: string;

  constructor(pointer, parameter) {
    this.pointer = pointer && "/data/attributes/" + pointer;
    this.parameter = parameter;
  }
}

interface ScaffoldErrorOptions {
  pointer?: string;
  parameter?: string;
  status: number;
  code: string;
  detail?: string;
  source?: Source;
  title?: string;
}

class ScaffoldError extends Error {
  status: number;
  code: string;
  detail?: string;
  source?: Source;
  title?: string;

  constructor({
    title,
    status,
    code,
    detail,
    pointer,
    parameter,
  }: ScaffoldErrorOptions) {
    super();
    this.status = status || statusCodes.INTERNAL_SERVER_ERROR;
    this.code = code || codes.ERR_SERVER_ERROR;
    this.detail = detail;
    this.source = new Source(pointer, parameter);
    this.title = title || "Server Error ocurred";
  }
}

class ValidationError extends ScaffoldError {
  constructor(params) {
    super(params);
    this.status = params.status || statusCodes.BAD_REQUEST;
  }
}

class NotFoundError extends ScaffoldError {
  constructor(params) {
    super(params);
    this.title = params.title || "Not found";
    this.code = codes.ERR_NOT_FOUND;
    this.status = statusCodes.NOT_FOUND;
  }
}

class UniqueConstraintError extends ScaffoldError {
  constructor(params) {
    super(params);
    this.title = params.title || "Conflict";
    this.code = codes.ERR_CONFLICT;
    this.status = statusCodes.CONFLICT;
  }
}

class ConflictError extends ScaffoldError {
  constructor(params) {
    super(params);
    this.title = params.title || "Conflict";
    this.code = codes.ERR_CONFLICT;
    this.status = statusCodes.CONFLICT;
  }
}

export {
  ScaffoldErrorOptions,
  ScaffoldError,
  ValidationError,
  NotFoundError,
  UniqueConstraintError,
  ConflictError,
};
