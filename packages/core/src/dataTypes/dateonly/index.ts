import { getFinalize } from "./getFinalize.js"
import { getPartialControl } from "./getPartialControl.js"
import { getPartialOrm } from "./getPartialOrm.js"
import type {
  FinalDateonlyORM,
  PartialDateonlyControlType,
  PartialDateonlyORM,
  PartialDateonlyProps,
} from "./types.js"
import type { PartialAttribute } from "../../types/index.js"

export * from "./getFinalize.js"
export * from "./getPartialControl.js"
export * from "./getPartialOrm.js"
export * from "./isISO8601DateString.js"
export * from "./types.js"

export function dateonly<TRequired extends boolean = false>(
  props?: PartialDateonlyProps<TRequired>,
): PartialAttribute<
  PartialDateonlyORM,
  PartialDateonlyControlType<TRequired>,
  string,
  FinalDateonlyORM
> {
  return {
    name: `dateonly(${props ? JSON.stringify(props) : ""})`,
    orm: getPartialOrm(props),
    control: getPartialControl(props),
    finalize: function finalizeDateonly() {
      return getFinalize(this)
    },
  }
}
