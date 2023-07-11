import { HatchifyError } from "./HatchifyError"
import { codes, statusCodes } from "../constants"

export class NotFoundError extends HatchifyError {
  constructor({ detail }: { detail: string }) {
    super({
      title: "Not Found",
      code: codes.ERR_NOT_FOUND,
      status: statusCodes.NOT_FOUND,
      detail,
    })
  }
}
