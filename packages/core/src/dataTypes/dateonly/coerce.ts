import { isISO8601DateString } from "./isISO8601DateString"
import type { PartialDateonlyControlType } from "./types"
import { HatchifyCoerceError } from "../../types"
import type { ValueInRequest } from "../../types"

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
    throw new HatchifyCoerceError("as an ISO 8601 date string")
  }

  if (control.min != null && value < control.min) {
    throw new HatchifyCoerceError(`after or on ${control.min}`)
  }

  if (control.max != null && value > control.max) {
    throw new HatchifyCoerceError(`before or on ${control.max}`)
  }

  return value
}
