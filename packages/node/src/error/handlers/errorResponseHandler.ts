import { HatchifyCoerceError } from "@hatchifyjs/hatchify-core"
import type { ValidationErrorItem } from "sequelize"

import { databaseErrorHandler } from "./databaseErrorHandler"
import type { SequelizeError } from "./databaseErrorHandler"
import { hatchifyErrorHandler } from "./hatchifyErrorHandler"
import { statusCodes } from "../constants"
import { UnexpectedValueError } from "../types"
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

  if (Array.isArray(error)) {
    return { errors: error, status: error[0].status }
  }

  if (error.name === "SequelizeValidationError") {
    const { errors }: SequelizeError = error

    if (errors?.[0].validatorKey === "schemaValidation") {
      return {
        errors: errors.map((validationError) => {
          const { path, message, original, value } =
            validationError as ValidationErrorItem & { original: Error }

          return original instanceof HatchifyCoerceError
            ? new UnexpectedValueError({
                detail: `Payload must have '${path}' ${message} but received '${value}' instead.`,
                pointer: `/data/attributes/${path}`,
              })
            : databaseErrorHandler(error as SequelizeError)
        }),
        status: statusCodes.UNPROCESSABLE_ENTITY,
      }
    }
  }

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
