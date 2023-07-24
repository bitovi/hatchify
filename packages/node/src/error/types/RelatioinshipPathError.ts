import { HatchifyError } from "./HatchifyError"
import { codes, statusCodes } from "../constants"

export class RelationshipPathError extends HatchifyError {
  constructor({
    detail = "URL must include an identifiable relationship path",
    pointer,
  }: {
    detail?: string
    pointer?: string
  } = {}) {
    super({
      status: statusCodes.BAD_REQUEST,
      code: codes.ERR_RELATIONSHIP_PATH,
      title: "Relationship path could not be identified.",
      detail,
      parameter: "include",
      pointer,
    })
  }
}
