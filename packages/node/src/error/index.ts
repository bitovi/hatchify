import { codes, statusCodes } from "./constants"
import { HatchifyError } from "./errors"
import { databaseErrorHandlers } from "./types/database-errors"
import type { SequelizeError } from "./types/database-errors"
import { hatchifyErrorHandler } from "./types/general-errors"

export type GeneralError = SequelizeError | HatchifyError

export interface ErrorResponse {
  errors: GeneralError[]
  status: number
}

export function errorResponseHandler(error: Error): ErrorResponse {
  if (error.name === "ValidationError") {
    return {
      errors: [
        new HatchifyError({
          title: error.message,
          code: codes.ERR_INVALID_PARAMETER,
          status: statusCodes.BAD_REQUEST,
        }),
      ],
      status: statusCodes.BAD_REQUEST,
    }
  }

  const errors: GeneralError[] = []

  let status = statusCodes.INTERNAL_SERVER_ERROR

  console.error("Internal Server Error:", error)

  if (
    [
      "SequelizeDatabaseError",
      "SequelizeUniqueConstraintError",
      "SequelizeValidationError",
      "SequelizeForeignKeyConstraintError",
    ].includes(error.name)
  ) {
    errors.push(databaseErrorHandlers(error as SequelizeError))
  } else {
    errors.push(hatchifyErrorHandler(error as HatchifyError))
  }

  status = errors[0].status || status

  return { errors, status }
}
