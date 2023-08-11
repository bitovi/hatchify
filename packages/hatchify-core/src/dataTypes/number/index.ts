import { getControl } from "./getControl"
import { getFinalize } from "./getFinalize"
import { getOrm } from "./getOrm"
import type {
  FinalNumberORM,
  PartialAttribute,
  PartialNumberControlType,
  PartialNumberORM,
  PartialNumberProps,
} from "../../types"

export function number(
  props?: PartialNumberProps,
): PartialAttribute<
  PartialNumberORM,
  PartialNumberControlType,
  number,
  FinalNumberORM
> {
  const name = `number(${props ? JSON.stringify(props) : ""})`

  return {
    name,
    orm: getOrm(false, props),
    control: getControl(false, props),
    finalize: () => getFinalize(name, props),
  }
}
