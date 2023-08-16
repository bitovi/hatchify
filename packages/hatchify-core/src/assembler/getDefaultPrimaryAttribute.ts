import { integer } from "../dataTypes"
import type {
  FinalNumberORM,
  PartialNumberControlType,
  PartialNumberORM,
} from "../dataTypes/number"
import type { PartialAttribute } from "../types"

export function getDefaultPrimaryAttribute(): PartialAttribute<
  PartialNumberORM,
  PartialNumberControlType,
  number,
  FinalNumberORM
> {
  return integer({
    primary: true,
    autoIncrement: true,
    required: true,
    min: 1,
  })
}
