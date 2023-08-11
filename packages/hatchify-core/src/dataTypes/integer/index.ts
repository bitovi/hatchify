import { getFinalize } from "./getFinalize"
import { getOrm } from "./getOrm"
import type {
  FinalNumberORM,
  PartialAttribute,
  PartialNumberControlType,
  PartialNumberORM,
  PartialNumberProps,
} from "../../types"
import { getControl } from "../number/getControl"

export function integer(
  props?: PartialNumberProps,
): PartialAttribute<
  PartialNumberORM,
  PartialNumberControlType,
  number,
  FinalNumberORM
> {
  const name = `integer(${props ? JSON.stringify(props) : ""})`
  const integerProps = { ...props, step: 1 }

  return {
    name,
    orm: getOrm(false, integerProps),
    control: getControl(false, integerProps),
    finalize: () => getFinalize(name, integerProps),
  }
}
