import { HatchifyError } from "../types"
import type { HatchifyErrorOptions } from "../types"

export function hatchifyErrorHandler(
  error: HatchifyErrorOptions,
): HatchifyError {
  console.error("Uncaught Hatchify Error:", error)

  if (error instanceof HatchifyError) {
    return error
  }

  return new HatchifyError(error)
}
