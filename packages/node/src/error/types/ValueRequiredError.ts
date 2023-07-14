import { HatchifyError } from "./HatchifyError"
import type { HatchifyErrorOptions } from "./HatchifyError"
import { codes, statusCodes } from "../constants"

export class ValueRequiredError extends HatchifyError {
  constructor({
    detail,
    parameter,
    pointer,
    title,
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
