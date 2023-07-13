import { HatchifyError } from "./HatchifyError"
import { codes, statusCodes } from "../constants"

export class UnexpectedValueError extends HatchifyError {
  constructor(params) {
    super(params)
    this.title = params.title || "Conflict"
    this.code = codes.ERR_UNEXPECTED_VALUE
    this.status = statusCodes.UNPROCESSABLE_ENTITY
  }
}
