import type { PartialStringControlType } from "./types.js"
import { HatchifyCoerceError } from "../../types/index.js"
import type { ValueInRequest } from "../../types/index.js"

export function coerce(
  value: ValueInRequest,
  control: Omit<PartialStringControlType<boolean>, "allowNullInfer">,
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

  if (typeof value !== "string") {
    throw new HatchifyCoerceError("as a string")
  }

  if (control.min != null && value.length < control.min) {
    throw new HatchifyCoerceError(
      `with length greater than or equal to ${control.min}`,
    )
  }

  if (control.max != null && value.length > control.max) {
    throw new HatchifyCoerceError(
      `with length less than or equal to ${control.max}`,
    )
  }

  if (control.regex && !control.regex.test(value)) {
    throw new HatchifyCoerceError(`with format of ${control.regex}`)
  }

  return value
}
