import { uuid } from "../dataTypes/index.js"
import type { PartialAttributeOptions } from "../types/index.js"
import { uuidv4 } from "../util/uuidv4.js"

<<<<<<< HEAD
export function getDefaultPrimaryAttribute(): PartialAttribute<
  PartialUuidORM,
  Omit<PartialStringControlType<boolean>, "allowNullInfer" | "ui">,
  string,
  FinalUuidORM
> {
=======
export function getDefaultPrimaryAttribute(): PartialAttributeOptions {
>>>>>>> main
  return uuid({
    primary: true,
    required: true,
    default: uuidv4,
  })
}
