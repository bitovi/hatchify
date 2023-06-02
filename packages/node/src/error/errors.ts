import { codes, statusCodes } from "./constants"

class Source {
  pointer?: string
  parameter?: string

  constructor(pointer?: string, parameter?: string) {
    this.pointer = pointer && "/data/attributes/" + pointer
    this.parameter = parameter
  }
}

interface HatchifyErrorOptions {
  pointer?: string
  parameter?: string
  status: number
  code: string
  detail?: string
  source?: Source
  title?: string
}

class HatchifyError extends Error {
  status: number
  code: string
  detail?: string
  source?: Source
  title?: string

  constructor({
    title,
    status,
    code,
    detail,
    pointer,
    parameter,
  }: HatchifyErrorOptions) {
    super()
    this.status = status || statusCodes.INTERNAL_SERVER_ERROR
    this.code = code || codes.ERR_SERVER_ERROR
    this.detail = detail
    this.source = new Source(pointer, parameter)
    this.title = title || "Server Error ocurred"
  }
}

class ValidationError extends HatchifyError {
  constructor(params) {
    super(params)
    this.status = params.status || statusCodes.BAD_REQUEST
  }
}

class NotFoundError extends HatchifyError {
  constructor(params) {
    super(params)
    this.title = params.title || "Not found"
    this.code = codes.ERR_NOT_FOUND
    this.status = statusCodes.NOT_FOUND
  }
}

class UniqueConstraintError extends HatchifyError {
  constructor(params) {
    super(params)
    this.title = params.title || "Conflict"
    this.code = codes.ERR_CONFLICT
    this.status = statusCodes.CONFLICT
  }
}

class ConflictError extends HatchifyError {
  constructor(params) {
    super(params)
    this.title = params.title || "Conflict"
    this.code = codes.ERR_CONFLICT
    this.status = statusCodes.CONFLICT
  }
}

export type { HatchifyErrorOptions }
export {
  HatchifyError,
  ValidationError,
  NotFoundError,
  UniqueConstraintError,
  ConflictError,
}
