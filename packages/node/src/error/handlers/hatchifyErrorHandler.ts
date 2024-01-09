import { HatchifyError } from "../types/index.js"
import type { HatchifyErrorOptions } from "../types/index.js"

export function hatchifyErrorHandler(
  error: HatchifyErrorOptions,
): HatchifyError {
  console.error("Uncaught Hatchify Error:", error)

  if (error instanceof HatchifyError) {
    return error
  }

  return new HatchifyError(error)
}
