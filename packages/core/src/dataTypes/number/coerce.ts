import type { PartialNumberControlType } from "./types"
import { validateStep } from "./validateStep"
import { HatchifyCoerceError } from "../../types"
import type { ValueInRequest } from "../../types"

export function coerce(
  value: ValueInRequest,
  control: Omit<PartialNumberControlType<boolean>, "allowNullInfer">,
): number | null {
  if (value === undefined) {
    throw new HatchifyCoerceError("as a non-undefined value")
  }

  if (value === null) {
    if (control.allowNull) {
      return value
    }
    throw new HatchifyCoerceError("as a non-null value")
  }

  if (typeof value !== "number") {
    throw new HatchifyCoerceError("as a number")
  }

  if ([-Infinity, Infinity].includes(value)) {
    throw new HatchifyCoerceError("different than Infinity")
  }

  if (value < Number.MIN_SAFE_INTEGER || value > Number.MAX_SAFE_INTEGER) {
    throw new HatchifyCoerceError("within safe integer range")
  }

  if (control.min != null && value < control.min) {
    throw new HatchifyCoerceError(`greater than or equal to ${control.min}`)
  }

  if (control.max != null && value > control.max) {
    throw new HatchifyCoerceError(`less than or equal to ${control.max}`)
  }

  if (!validateStep(value, control.step, control.min)) {
    throw new HatchifyCoerceError(`as multiples of ${control.step}`)
  }

  return value
}
