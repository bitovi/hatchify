import { getFinalize } from "./getFinalize.js"
import { getPartialControl } from "./getPartialControl.js"
import { getPartialOrm } from "./getPartialOrm.js"
import type {
  FinalNumberORM,
  PartialNumberControlType,
  PartialNumberORM,
  PartialNumberProps,
} from "./types.js"
import type { PartialAttribute } from "../../types/index.js"

export * from "./getFinalize.js"
export * from "./getPartialControl.js"
export * from "./getPartialOrm.js"
export * from "./types.js"

export function number<TRequired extends boolean = false>(
  props?: PartialNumberProps<TRequired>,
): PartialAttribute<
  PartialNumberORM,
  PartialNumberControlType<TRequired>,
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
