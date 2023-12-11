import { getFinalize } from "./getFinalize"
import { getPartialControl } from "./getPartialControl"
import { getPartialOrm } from "./getPartialOrm"
import type {
  FinalDateonlyORM,
  PartialDateonlyControlType,
  PartialDateonlyORM,
  PartialDateonlyProps,
} from "./types"
import type { PartialAttribute } from "../../types"

export * from "./getFinalize"
export * from "./getPartialControl"
export * from "./getPartialOrm"
export * from "./isISO8601DateString"
export * from "./types"

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
