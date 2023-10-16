import { getPartialControl } from "./getPartialControl"
import { getPartialOrm } from "./getPartialOrm"
import type { PartialAttribute } from "../../types"
import { getFinalize } from "../number"
import type {
  FinalNumberORM,
  PartialNumberControlType,
  PartialNumberORM,
  PartialNumberProps,
} from "../number"

export function integer<TRequired extends boolean = false>(
  props?: PartialNumberProps<TRequired>,
): PartialAttribute<
  PartialNumberORM,
  PartialNumberControlType<TRequired>,
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
