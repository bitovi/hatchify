import { HatchifyCoerceError } from "@hatchifyjs/core"
import {
  DatabaseError,
  ForeignKeyConstraintError,
  UniqueConstraintError,
  ValidationError,
} from "sequelize"
import type { ValidationErrorItem } from "sequelize"

import { hatchifyErrorHandler } from "./hatchifyErrorHandler.js"
import { codes, statusCodes } from "../constants.js"
import {
  HatchifyError,
  UnexpectedValueError,
  ValueRequiredError,
} from "../types/index.js"

interface SequelizeError {
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

  if (error instanceof UniqueConstraintError) {
    return {
      status: statusCodes.CONFLICT,
      errors: error.errors.map(
        ({ path }) =>
          new HatchifyError({
            status: statusCodes.CONFLICT,
            code: codes.ERR_CONFLICT,
            title: "Unique key constraint violation.",
            detail: `Record with ${path} already exists`,
          }),
      ),
    }
  }

  if (error instanceof ForeignKeyConstraintError) {
    return {
      status: statusCodes.CONFLICT,
      errors: [
        new HatchifyError({
          status: statusCodes.CONFLICT,
          code: codes.ERR_CONFLICT,
          title: "Foreign key constraint violation.",
          detail: error.message,
        }),
      ],
    }
  }

  if (error instanceof ValidationError) {
    const { errors } = error

    return {
      status: statusCodes.UNPROCESSABLE_ENTITY,
      errors: errors.map((validationError) => {
        const { path, message, original, value, validatorArgs, instance } =
          validationError as ValidationErrorItem & { original: Error }

        if (original instanceof HatchifyCoerceError) {
          return new UnexpectedValueError({
            detail: `Payload must have '${path}' ${message} but received '${value}' instead.`,
            pointer: `/data/attributes/${path}`,
          })
        }

        if (validationError.type?.toLowerCase() === "notnull violation") {
          return new ValueRequiredError({
            title: "Payload is missing a required value.",
            detail: `Payload must include a value for '${path}'.`,
            pointer: `/data/attributes/${path}`,
          })
        }

        if (validationError.validatorKey === "isIn") {
          return new UnexpectedValueError({
            detail: `${instance?.constructor
              .name} must have '${path}' as one of ${(
              validatorArgs[0] as string[]
            )
              .map((a) => `'${a}'`)
              .join(", ")}.`,
            pointer: `/data/attributes/${path}`,
          })
        }

        return new UnexpectedValueError({
          detail: "Unexpected value received",
          pointer: `/data/attributes/${path}`,
        })
      }),
    }
  }

  if (error instanceof DatabaseError) {
    if (
      [
        "Retrieved number is outside of the JavaScript number range",
        "Retrieved number is outside of the JavaScript safe integer range",
      ].includes(error.original.message) ||
      error.original.message.endsWith("is out of range for type integer")
    ) {
      return {
        status: statusCodes.UNPROCESSABLE_ENTITY,
        errors: [
          new UnexpectedValueError({
            detail: error.original.message,
          }),
        ],
      }
    }

    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      errors: [
        new HatchifyError({
          status: statusCodes.INTERNAL_SERVER_ERROR,
          code: codes.ERR_SERVER_ERROR,
          title: "Unexpected Error",
          detail: error.message,
        }),
      ],
    }
  }

  errors.push(hatchifyErrorHandler(error as HatchifyError))

  return {
    errors,
    status: errors[0].status || statusCodes.INTERNAL_SERVER_ERROR,
  }
}
