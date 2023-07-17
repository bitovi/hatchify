import { HatchifyError } from "./HatchifyError"
import type { HatchifyErrorOptions } from "./HatchifyError"
import { codes, statusCodes } from "../constants"

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
