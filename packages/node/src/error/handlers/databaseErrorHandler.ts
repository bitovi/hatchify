import type { Error } from "sequelize"

import { codes, statusCodes } from "../constants"
import {
  HatchifyError,
  UnexpectedValueError,
  UniqueConstraintError,
  ValueRequiredError,
} from "../types"

export interface SequelizeError {
  errors?: Array<{
    path: string
    type: string
    validatorKey: string
    validatorArgs: string[][]
    instance: object
  }>
  message: string
  name: string
  status?: number
}

export function databaseErrorHandler(error: SequelizeError): Error {
  const { name, message } = error
  const pointer = error.errors?.[0].path

  if (name === "SequelizeValidationError") {
    if (error.errors?.[0].type === "notNull Violation") {
      error = new ValueRequiredError({
        title: "Payload is missing a required value.",
        detail: `Payload must include a value for '${error.errors[0].path}'.`,
        pointer: `/data/attributes/${pointer}`,
      })
    } else if (error.errors?.[0].validatorKey === "isIn") {
      error = new UnexpectedValueError({
        detail: `${error.errors[0].instance.constructor.name} must have '${
          error.errors[0].path
        }' as one of ${error.errors[0].validatorArgs[0]
          .map((a) => `'${a}'`)
          .join(", ")}.`,
        pointer: `/data/attributes/${pointer}`,
      })
    }
  } else {
    switch (name) {
      case "SequelizeUniqueConstraintError":
        error = new UniqueConstraintError({
          title: `Record with ${pointer} already exists`,
          pointer,
        })

        break

      case "SequelizeForeignKeyConstraintError":
        error = new HatchifyError({
          code: codes.ERR_CONFLICT,
          title: "Foreign key constraint violation",
          status: statusCodes.CONFLICT,
        })
        break

      case "SequelizeDatabaseError":
        switch (message) {
          case `SQLITE_ERROR: near "ILIKE": syntax error`:
            error = new HatchifyError({
              code: codes.ERR_DATABASE_ERROR,
              title: "SQLITE does not support ilike. Please use like",
              status: statusCodes.INTERNAL_SERVER_ERROR,
            })
            break

          default:
            error = new HatchifyError({
              code: codes.ERR_DATABASE_ERROR,
              title: message,
              status: statusCodes.INTERNAL_SERVER_ERROR,
            })
            break
        }
    }
  }

  return error
}
