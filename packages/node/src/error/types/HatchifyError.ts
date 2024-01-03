import { codes, statusCodes } from "../constants.js"

interface Source {
  pointer?: string
  parameter?: string
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
    status = statusCodes.INTERNAL_SERVER_ERROR,
    code = codes.ERR_SERVER_ERROR,
    title = "Server Error ocurred",
    detail,
    parameter,
    pointer,
  }: HatchifyErrorOptions) {
    super()
    this.status = status
    this.code = code
    this.detail = detail
    this.title = title

    if (parameter) {
      this.source = { parameter }
    }

    if (pointer) {
      this.source = { pointer }
    }
  }
}
