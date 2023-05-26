import { statusCodes } from "./constants"
import databaseErrorHandlers from "./types/database-errors"
import ScaffoldErrorHandler from "./types/general-errors"

const errorResponseHandler = (error) => {
  const errors: any[] = []

  let status = statusCodes.INTERNAL_SERVER_ERROR

  if (
    [
      "SequelizeDatabaseError",
      "SequelizeUniqueConstraintError",
      "SequelizeValidationError",
      "SequelizeForeignKeyConstraintError",
    ].includes(error.name)
  ) {
    errors.push(databaseErrorHandlers(error))
  } else {
    errors.push(ScaffoldErrorHandler(error))
  }

  status = errors[0].status || status

  return { errors, status }
}

export default errorResponseHandler
