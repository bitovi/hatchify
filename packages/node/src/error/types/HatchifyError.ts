import { codes, statusCodes } from "../constants"

interface Source {
  pointer: string
}

export interface HatchifyErrorOptions {
  pointer?: string
  parameter?: string
  status: number
  code: string
  detail?: string
  source?: Source
  title?: string
}

export class HatchifyError extends Error {
  status: number
  code: string
  detail?: string
  source?: Source
  title?: string

  constructor({
    title,
    status,
    code,
    detail,
    pointer,
    parameter,
  }: HatchifyErrorOptions) {
    super()
    this.status = status || statusCodes.INTERNAL_SERVER_ERROR
    this.code = code || codes.ERR_SERVER_ERROR
    this.detail = detail
    this.title = title || "Server Error ocurred"

    if (pointer) {
      this.source = { pointer }
    }
  }
}
