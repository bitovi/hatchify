import { HatchifyError } from "./HatchifyError"
import { codes } from "../constants"
import type { statusCodes } from "../constants"

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
