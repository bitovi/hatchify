import { HatchifyError } from "./HatchifyError.js"
import { codes, statusCodes } from "../constants.js"

export class ValidationError extends HatchifyError {
  constructor({ title, pointer }: { title: string; pointer?: string }) {
    super({
      title,
      status: statusCodes.UNPROCESSABLE_ENTITY,
      code: codes.ERR_INVALID_PARAMETER,
      pointer,
    })
  }
}
