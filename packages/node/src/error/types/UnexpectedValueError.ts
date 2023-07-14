import { HatchifyError } from "./HatchifyError"
import { codes, statusCodes } from "../constants"

export class UnexpectedValueError extends HatchifyError {
  constructor({ title, parameter }: { title?: string; parameter?: string }) {
    super({
      title: title || "Unexpected value.",
      code: codes.ERR_UNEXPECTED_VALUE,
      status: statusCodes.UNPROCESSABLE_ENTITY,
      parameter,
    })
  }
}
