import type { PartialDatetimeControlType } from "./types.js"
import { validateStep } from "./validateStep.js"
import { HatchifyCoerceError } from "../../types/index.js"
import type { ValueInRequest } from "../../types/index.js"

export function coerce(
  value: ValueInRequest,
  control: Omit<PartialDatetimeControlType<boolean>, "allowNullInfer">,
): Date | null {
  if (value === undefined) {
    throw new HatchifyCoerceError("as a non-undefined value")
  }

  if (value === null) {
    if (control.allowNull) {
      return value
    }
    throw new HatchifyCoerceError("as a non-null value")
  }

  if (!(value instanceof Date)) {
    throw new HatchifyCoerceError("as an ISO 8601 date and time string")
  }

  if (control.min != null && value < control.min) {
    throw new HatchifyCoerceError(
      `after or on ${new Date(control.min).toISOString()}`,
    )
  }

  if (control.max != null && value > control.max) {
    throw new HatchifyCoerceError(
      `before or on ${new Date(control.max).toISOString()}`,
    )
  }

  if (!validateStep(value, control.step, control.min)) {
    throw new HatchifyCoerceError(`as multiples of ${control.step}`)
  }

  return value
}
