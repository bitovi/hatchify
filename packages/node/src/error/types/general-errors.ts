import { HatchifyError } from "../errors"
import type { HatchifyErrorOptions } from "../errors"

export function hatchifyErrorHandler(
  error: HatchifyErrorOptions,
): HatchifyError {
  if (error instanceof HatchifyError) {
    return error
  }

  return new HatchifyError(error)
}
