import Chance from "chance"

const chance = new Chance()

const compareDates = (date1, date2) =>
  date1 && date2 && new Date(date1) < new Date(date2)

// Formats the date to 'YYYY-MM-DD' and if the offset parameter is passed in, adds the offset to the day to avoid overlap
const toDateFormat = (date) => {
  date = new Date(date)

  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

const addDaysToDate = (
  date,
  days = chance.integer({ min: 10, max: 365 * 2 }),
) => {
  date = new Date(date)

  date.setDate(date.getDate() + days)

  return toDateFormat(date)
}

/*
Function that returns an Object that includes a range of dates as follows:
  beforeStartDate->startDate->startBeforeAssignmentDate->endAssignmentDate->endAfterAssignmentDate->endDate->afterEndDate
*/
const dateGenerator = function () {
  const past = addDaysToDate(new Date(), -10 * 365)
  const beforeStartDate = toDateFormat(new Date())
  const startDate = addDaysToDate(beforeStartDate)
  const startBeforeAssignmentDate = addDaysToDate(startDate)
  const startAssignmentDate = addDaysToDate(startBeforeAssignmentDate)
  const endAssignmentDate = addDaysToDate(startAssignmentDate)
  const endAfterAssignmentDate = addDaysToDate(endAssignmentDate)
  const endDate = addDaysToDate(endAfterAssignmentDate)
  const afterEndDate = addDaysToDate(endDate)
  const future = addDaysToDate(afterEndDate, 10 * 365)

  return {
    past,
    beforeStartDate,
    startDate,
    startBeforeAssignmentDate,
    startAssignmentDate,
    endAssignmentDate,
    endAfterAssignmentDate,
    endDate,
    afterEndDate,
    future,
  }
}

export { compareDates, toDateFormat, dateGenerator }
