import { HatchifyError } from "./HatchifyError.js"
import { codes, statusCodes } from "../constants.js"

export class UnexpectedValueError extends HatchifyError {
  constructor({
    detail,
    parameter,
    pointer,
  }: {
    detail?: string
    parameter?: string
    pointer?: string
  }) {
    super({
      status: statusCodes.UNPROCESSABLE_ENTITY,
      code: codes.ERR_UNEXPECTED_VALUE,
      title: "Unexpected value.",
      detail,
      parameter,
      pointer,
    })
  }
}
