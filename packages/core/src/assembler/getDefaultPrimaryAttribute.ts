import { uuid } from "../dataTypes"
import type { PartialStringControlType } from "../dataTypes/string"
import type { FinalUuidORM, PartialUuidORM } from "../dataTypes/uuid/types"
import type { PartialAttribute } from "../types"
import { uuidv4 } from "../util/uuidv4"

export function getDefaultPrimaryAttribute(): PartialAttribute<
  PartialUuidORM,
  Omit<PartialStringControlType<boolean>, "allowNullInfer">,
  string,
  FinalUuidORM
> {
  return uuid({
    primary: true,
    required: true,
    default: uuidv4,
  })
}
