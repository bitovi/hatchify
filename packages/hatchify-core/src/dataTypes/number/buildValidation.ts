import type { SequelizeNumberValidation } from "../../types"

export function buildNumberValidation(
  min?: number,
  max?: number,
): Record<string, never> | SequelizeNumberValidation {
  const validate = {
    ...([null, undefined, -Infinity].includes(min) ? {} : { min }),
    ...([null, undefined, Infinity].includes(max) ? {} : { max }),
  }

  return Object.keys(validate).length ? { validate } : {}
}
