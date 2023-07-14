import { HatchifyError } from "../types"
import type { HatchifyErrorOptions } from "../types"

export function hatchifyErrorHandler(
  error: HatchifyErrorOptions,
): HatchifyError {
  if (error instanceof HatchifyError) {
    return error
  }

  return new HatchifyError(error)
}
