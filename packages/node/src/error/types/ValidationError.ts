import { HatchifyError } from "./HatchifyError.js"
import { codes } from "../constants.js"
import type { statusCodes } from "../constants.js"

export class ValidationError extends HatchifyError {
  constructor({
    title,
    status,
    code,
    pointer,
  }: {
    title: string
    status: statusCodes
    code?: codes
    pointer?: string
  }) {
    super({
      title,
      status,
      code: code || codes.ERR_INVALID_PARAMETER,
      pointer,
    })
  }
}
