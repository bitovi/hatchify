import type { PartialBooleanControlType } from "./types"
import { HatchifyCoerceError } from "../../types"
import type { ValueInRequest } from "../../types"

export function coerce(
  value: ValueInRequest,
  control: Partial<PartialBooleanControlType<boolean>>,
): boolean | null {
  if (value === undefined) {
    throw new HatchifyCoerceError("as a non-undefined value")
  }

  if (value === null) {
    if (control.allowNull) {
      return value
    }
    throw new HatchifyCoerceError("as a non-null value")
  }

  if (typeof value !== "boolean") {
    throw new HatchifyCoerceError("as a boolean")
  }

  return value
}
