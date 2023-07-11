import { HatchifyError } from "./HatchifyError"
import { codes, statusCodes } from "../constants"

export class MissingDataError extends HatchifyError {
  constructor() {
    super({
      status: statusCodes.UNPROCESSABLE_ENTITY,
      code: codes.ERR_MISSING_DATA,
      title: "'data' must be specified for this operation.",
      detail: "Payload was missing 'data' field. It can not be null/undefined.",
      pointer: "/data",
    })
  }
}
