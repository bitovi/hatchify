import { getPartialControl } from "./getPartialControl"
import { getPartialOrm } from "./getPartialOrm"
import type {
  FinalNumberORM,
  PartialAttribute,
  PartialNumberControlType,
  PartialNumberORM,
  PartialNumberProps,
} from "../../types"
import { getFinalize } from "../number/getFinalize"

export function integer(
  props?: PartialNumberProps,
): PartialAttribute<
  PartialNumberORM,
  PartialNumberControlType,
  number,
  FinalNumberORM
> {
  return {
    name: `integer(${props ? JSON.stringify(props) : ""})`,
    orm: getPartialOrm(props),
    control: getPartialControl(props),
    finalize: function finalizeInteger() {
      return getFinalize(this)
    },
  }
}
