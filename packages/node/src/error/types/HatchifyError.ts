import { codes, statusCodes } from "../constants"

interface Source {
  /**
   * a JSON Pointer [RFC6901] to the value in the request document that caused the error [e.g. `"/data"` for a primary data object, or `"/data/attributes/title"` for a specific attribute]. This **MUST** point to a value in the request document that exists; if it doesn’t, the client **SHOULD** simply ignore the pointer.
   */
  pointer?: string
  /**
   * a string indicating which URI query parameter caused the error.
   */
  parameter?: string
}

export interface HatchifyErrorOptions {
  /**
   * a JSON Pointer [RFC6901] to the value in the request document that caused the error [e.g. `"/data"` for a primary data object, or `"/data/attributes/title"` for a specific attribute]. This **MUST** point to a value in the request document that exists; if it doesn’t, the client **SHOULD** simply ignore the pointer.
   */
  pointer?: string
  /**
   * a string indicating which URI query parameter caused the error.
   */
  parameter?: string
  /**
   * the HTTP status code applicable to this problem, expressed as a string value. This **SHOULD** be provided.
   */
  status: number
  /**
   * an application-specific error code, expressed as a string value.
   */
  code: string
  /**
   * a human-readable explanation specific to this occurrence of the problem. Like `title`, this field’s value can be localized.
   */
  detail?: string
  /**
   * an object containing references to the primary source of the error. It **SHOULD** include pointer or parameter or be omitted
   */
  source?: Source
  /**
   * a short, human-readable summary of the problem that **SHOULD NOT** change from occurrence to occurrence of the problem, except for purposes of localization.
   */
  title?: string
}

export class HatchifyError extends Error {
  /**
   * the HTTP status code applicable to this problem, expressed as a string value. This **SHOULD** be provided.
   */
  status: number
  /**
   * an application-specific error code, expressed as a string value.
   */
  code: string
  /**
   * a human-readable explanation specific to this occurrence of the problem. Like `title`, this field’s value can be localized.
   */
  detail?: string
  /**
   * an object containing references to the primary source of the error. It **SHOULD** include pointer or parameter or be omitted
   */
  source?: Source
  /**
   * a short, human-readable summary of the problem that **SHOULD NOT** change from occurrence to occurrence of the problem, except for purposes of localization.
   */
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
