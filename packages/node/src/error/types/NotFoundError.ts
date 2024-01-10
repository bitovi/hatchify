import { HatchifyError } from "./HatchifyError.js"
import type { HatchifyErrorOptions } from "./HatchifyError.js"
import { codes, statusCodes } from "../constants.js"

export class NotFoundError extends HatchifyError {
  constructor({
    detail,
    parameter,
    pointer,
  }: Pick<HatchifyErrorOptions, "detail" | "parameter" | "pointer">) {
    super({
      code: codes.ERR_NOT_FOUND,
      status: statusCodes.NOT_FOUND,
      title: "Resource not found.",
      detail,
      parameter,
      pointer,
    })
  }
}
