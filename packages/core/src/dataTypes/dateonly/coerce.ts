import { isISO8601DateString } from "./isISO8601DateString.js"
import type { PartialDateonlyControlType } from "./types.js"
import { validateStep } from "./validateStep.js"
import { HatchifyCoerceError } from "../../types/index.js"
import type { ValueInRequest } from "../../types/index.js"

export function coerce(
  value: ValueInRequest,
  control: Omit<PartialDateonlyControlType<boolean>, "allowNullInfer">,
): string | null {
  if (value === undefined) {
    throw new HatchifyCoerceError("as a non-undefined value")
  }

  if (value === null) {
    if (control.allowNull) {
      return value
    }
    throw new HatchifyCoerceError("as a non-null value")
  }

  if (typeof value !== "string" || !isISO8601DateString(value)) {
    throw new HatchifyCoerceError("as a 'YYYY-MM-DD' string")
  }

  if (control.min != null && value < control.min) {
    throw new HatchifyCoerceError(`after or on ${control.min}`)
  }

  if (control.max != null && value > control.max) {
    throw new HatchifyCoerceError(`before or on ${control.max}`)
  }

  const dateValue = new Date(value)
  const dateMin =
    typeof control.min === "string" ? new Date(control.min) : control.min

  if (!validateStep(dateValue, control.step, dateMin)) {
    throw new HatchifyCoerceError(`as multiples of ${control.step}`)
  }

  return value
}
