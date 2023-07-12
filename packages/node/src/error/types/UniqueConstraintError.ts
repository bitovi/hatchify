import { HatchifyError } from "./HatchifyError"
import { codes, statusCodes } from "../constants"

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
