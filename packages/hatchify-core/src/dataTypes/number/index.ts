import { getFinalize } from "./getFinalize"
import { getPartialControl } from "./getPartialControl"
import { getPartialOrm } from "./getPartialOrm"
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
  return {
    name: `number(${props ? JSON.stringify(props) : ""})`,
    orm: getPartialOrm(props),
    control: getPartialControl(props),
    finalize: function finalizeNumber() {
      return getFinalize(this)
    },
  }
}
