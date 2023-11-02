import type { PartialEnumControlType } from "./types"
import { HatchifyCoerceError } from "../../types"
import type { ValueInRequest } from "../../types"

export function coerce(
  value: ValueInRequest,
  control: Omit<
    PartialEnumControlType<boolean, readonly string[]>,
    "allowNullInfer"
  >,
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

  if (!control.values.includes(value as string)) {
    throw new HatchifyCoerceError(
      `as one of ${control.values.map((value) => `'${value}'`).join(", ")}`,
    )
  }

  return value as string
}
