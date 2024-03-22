import { HatchifyError } from "./HatchifyError.js"
import type { HatchifyErrorOptions } from "./HatchifyError.js"
import { codes, statusCodes } from "../constants.js"

export class ValueRequiredError extends HatchifyError {
  constructor({
    detail,
    parameter,
    pointer,
  }: Pick<HatchifyErrorOptions, "detail" | "parameter" | "pointer">) {
    super({
      status: statusCodes.UNPROCESSABLE_ENTITY,
      code: codes.ERR_VALUE_REQUIRED,
      title: "Payload is missing a required value.",
      detail,
      parameter,
      pointer,
    })
  }
}
