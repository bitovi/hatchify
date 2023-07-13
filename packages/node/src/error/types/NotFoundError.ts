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
      title: "Resource not found.",
      code: codes.ERR_NOT_FOUND,
      status: statusCodes.NOT_FOUND,
      detail,
      parameter,
      pointer,
    })
  }
}
