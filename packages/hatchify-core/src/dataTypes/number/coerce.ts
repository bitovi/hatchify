import { validateStep } from "./validateStep"
import type { PartialNumberControlType, ValueInRequest } from "../../types"

export function coerce(
  value: ValueInRequest,
  control: PartialNumberControlType,
): number | null {
  if (value === undefined) {
    throw new Error("Non-undefined value is required")
  }

  if (value === null) {
    if (control.allowNull) {
      return value
    }
    throw new Error("Non-null value is required")
  }

  if (typeof value !== "number") {
    throw new Error("Provided value is not a number")
  }

  if ([-Infinity, Infinity].includes(value)) {
    throw new Error("Infinity as a value is not supported")
  }

  if (control.min != null && value < control.min) {
    throw new Error(
      `Provided value is lower than the minimum of ${control.min}`,
    )
  }

  if (control.max != null && value > control.max) {
    throw new Error(
      `Provided value is higher than the maximum of ${control.max}`,
    )
  }

  if (!validateStep(value, control.step, control.min)) {
    throw new Error(`Provided value violates the step of ${control.step}`)
  }

  return value
}
