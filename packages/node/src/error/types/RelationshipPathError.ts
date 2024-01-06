import { HatchifyError } from "./HatchifyError.js"
import { codes, statusCodes } from "../constants.js"

export class RelationshipPathError extends HatchifyError {
  constructor({
    detail,
    parameter,
    pointer,
  }: {
    detail?: string
    parameter?: string
    pointer?: string
  } = {}) {
    super({
      status: statusCodes.BAD_REQUEST,
      code: codes.ERR_RELATIONSHIP_PATH,
      title: "Relationship path could not be identified.",
      detail,
      parameter,
      pointer,
    })
  }
}
