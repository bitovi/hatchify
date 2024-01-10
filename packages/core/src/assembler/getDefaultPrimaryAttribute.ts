import { uuid } from "../dataTypes/index.js"
import type { PartialStringControlType } from "../dataTypes/string/index.js"
import type { FinalUuidORM, PartialUuidORM } from "../dataTypes/uuid/types.js"
import type { PartialAttribute } from "../types/index.js"
import { uuidv4 } from "../util/uuidv4.js"

export function getDefaultPrimaryAttribute(): PartialAttribute<
  PartialUuidORM,
  Omit<PartialStringControlType<boolean>, "allowNullInfer" | "maxRenderLength">,
  string,
  FinalUuidORM
> {
  return uuid({
    primary: true,
    required: true,
    default: uuidv4,
  })
}
