import type { StringStep } from "./types.js"
import { HatchifyCoerceError } from "../../types/index.js"
import { validateStep as validateNumericStep } from "../number/validateStep.js"

const millisecond = 1
const second = 1000 * millisecond
const minute = 60 * second
const hour = 60 * minute
const day = 24 * hour
const week = 7 * day
const year = 365 * day
const decade = 10 * year

const Step: Record<StringStep, number> = {
  day,
  week,
  year,
  decade,
}

export function validateStep(
  value: Date,
  step?: StringStep | number,
  min?: Date | typeof Infinity,
): boolean {
  return validateNumericStep(
    value == null ? value : +value,
    parseStep(step),
    min instanceof Date ? +min : min,
  )
}

function parseStep(step?: StringStep | number) {
  if (typeof step === "string") {
    if (!Step[step]) {
      throw new HatchifyCoerceError(
        `as one of ${Object.keys(Step)
          .map((s) => `"${s}"`)
          .join(", ")}`,
      )
    }

    return Step[step]
  }

  if (step == null) {
    return day
  }

  return step * day
}
