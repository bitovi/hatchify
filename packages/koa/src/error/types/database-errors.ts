import { codes, statusCodes } from "../constants"
import {
  ScaffoldError,
  UniqueConstraintError,
  ValidationError,
} from "../errors"

const databaseErrorHandlers = (error) => {
  const { name, message } = error
  const pointer = error.errors[0].path

  if (name === "SequelizeValidationError") {
    if (error.errors[0].type === "notNull Violation") {
      error = new ValidationError({
        title: `${error.errors[0].path} is required.`,
        status: statusCodes.UNPROCESSABLE_ENTITY,
        pointer,
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
        error = new ScaffoldError({
          code: codes.ERR_CONFLICT,
          title: "Foreign key constraint violation",
          status: statusCodes.CONFLICT,
        })
        break

      case "SequelizeDatabaseError":
      default:
        error = new ScaffoldError({
          code: codes.ERR_DATABASE_ERROR,
          title: message,
          status: statusCodes.INTERNAL_SERVER_ERROR,
        })
        break
    }
  }

  return error
}

export default databaseErrorHandlers
