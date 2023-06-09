import { codes, statusCodes } from "@hatchifyjs/node"

import { Hatchify } from "../../../../express"

function dateRangeOverlaps(
  firstStartDate,
  firstEndDate,
  secondStartDate,
  secondEndDate,
) {
  if (firstStartDate < secondStartDate && secondStartDate < firstEndDate)
    return true // second starts in first
  if (firstStartDate < secondEndDate && secondEndDate < firstEndDate)
    return true // second ends in first
  if (secondStartDate < firstStartDate && firstEndDate < secondEndDate)
    return true // first in second
  return false
}

const validateAssignmentOverlap = async ({ body, Assignment }) => {
  if (body.employee_id) {
    try {
      const assignments = await Assignment.findAll({
        where: {
          employee_id: body.employee_id,
        },
      })

      assignments.forEach((assignment) => {
        const employeeEndDate = assignment.end_date ?? Infinity
        if (
          dateRangeOverlaps(
            body.start_date,
            body.end_date,
            assignment.start_date,
            employeeEndDate,
          )
        ) {
          throw Hatchify.createError({
            title: "Employee is already assigned for the same date",
            code: codes.ERR_CONFLICT,
            status: statusCodes.CONFLICT,
            pointer: "employee/start_date",
          })
        }
      })
    } catch (e) {
      throw Hatchify.createError({
        title: e.message,
        code: codes.ERR_CONFLICT,
        status: statusCodes.CONFLICT,
        pointer: "employee/id",
      })
    }
  }
}

export default validateAssignmentOverlap
