import type { PartialBooleanControlType } from "./types.js"
import type { ValueInRequest } from "../../types/index.js"
import { HatchifyCoerceError } from "../../types/index.js"

export function coerce(
  value: ValueInRequest,
  control: Omit<PartialBooleanControlType<boolean>, "allowNullInfer">,
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
