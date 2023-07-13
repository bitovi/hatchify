import { databaseErrorHandler } from "./databaseErrorHandler"
import type { SequelizeError } from "./databaseErrorHandler"
import { hatchifyErrorHandler } from "./hatchifyErrorHandler"
import { statusCodes } from "../constants"
import type { HatchifyError } from "../types"

type GeneralError = SequelizeError | HatchifyError

interface ErrorResponse {
  errors: GeneralError[]
  status: number
}

export function errorResponseHandler(
  error: Error | HatchifyError[],
): ErrorResponse {
  const errors: GeneralError[] = []

  if (Array.isArray(error)) return { errors: error, status: error[0].status }

  if (
    [
      "SequelizeDatabaseError",
      "SequelizeUniqueConstraintError",
      "SequelizeValidationError",
      "SequelizeForeignKeyConstraintError",
    ].includes(error.name)
  ) {
    errors.push(databaseErrorHandler(error as SequelizeError))
  } else {
    errors.push(hatchifyErrorHandler(error as HatchifyError))
  }

  return {
    errors,
    status: errors[0].status || statusCodes.INTERNAL_SERVER_ERROR,
  }
}
