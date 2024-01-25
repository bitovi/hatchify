import { uuid } from "../dataTypes/index.js"
import type { PartialAttributeOptions } from "../types/index.js"
import { uuidv4 } from "../util/uuidv4.js"

export function getDefaultPrimaryAttribute(): PartialAttributeOptions {
  return uuid({
    primary: true,
    required: true,
    default: uuidv4,
  })
}
