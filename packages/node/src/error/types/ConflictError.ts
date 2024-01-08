import { HatchifyError } from "./HatchifyError.js"
import { codes, statusCodes } from "../constants.js"

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
