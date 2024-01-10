import { HatchifyError } from "./HatchifyError.js"
import { codes, statusCodes } from "../constants.js"

export class UniqueConstraintError extends HatchifyError {
  constructor({ title, pointer }: { title: string; pointer?: string }) {
    super({
      title,
      code: codes.ERR_CONFLICT,
      status: statusCodes.CONFLICT,
      pointer,
    })
  }
}
