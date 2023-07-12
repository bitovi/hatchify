import { HatchifyError } from "./HatchifyError"
import { codes, statusCodes } from "../constants"

export class ConflictError extends HatchifyError {
  constructor({ pointer }: { pointer: string }) {
    super({
      title: "Conflict",
      code: codes.ERR_CONFLICT,
      status: statusCodes.CONFLICT,
      pointer,
    })
  }
}
