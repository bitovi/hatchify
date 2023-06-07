import { compareDates } from "./date"
import { statusCodes, ValidationError } from "@hatchifyjs/node"

const validateStartDate = (body) => {
  if (compareDates(body.end_date, body.start_date)) {
    throw new ValidationError({
      title: "startDate is after endDate",
      status: statusCodes.UNPROCESSABLE_ENTITY,
      pointer: "start_date",
    })
  }
}
// checks to see that both start_date and end_date, if not null, do not include time by checking the length of the input string
const validateDateFormat = (body) => {
  if (
    (body.start_date && body.start_date.length > 10) ||
    (body.end_date && body.end_date.length > 10)
  ) {
    throw new ValidationError({
      title: "incorrect date format",
      statusCode: statusCodes.UNPROCESSABLE_ENTITY,
      pointer: "start_date",
    })
  }
}

const isString = (str) => typeof str === "string"

export { validateStartDate, validateDateFormat, isString }
