import { HatchifyError } from "./HatchifyError.js"
import type { HatchifyErrorOptions } from "./HatchifyError.js"
import { codes, statusCodes } from "../constants.js"

export class ValueRequiredError extends HatchifyError {
  constructor({
    title,
    detail,
    parameter,
    pointer,
  }: Pick<HatchifyErrorOptions, "detail" | "parameter" | "pointer" | "title">) {
    super({
      status: statusCodes.UNPROCESSABLE_ENTITY,
      code: codes.ERR_VALUE_REQUIRED,
      title,
      detail,
      parameter,
      pointer,
    })
  }
}
