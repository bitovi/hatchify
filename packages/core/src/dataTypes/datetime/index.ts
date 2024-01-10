import { getFinalize } from "./getFinalize.js"
import { getPartialControl } from "./getPartialControl.js"
import { getPartialOrm } from "./getPartialOrm.js"
import type {
  FinalDatetimeORM,
  PartialDatetimeControlType,
  PartialDatetimeORM,
  PartialDatetimeProps,
} from "./types.js"
import type { PartialAttribute } from "../../types/index.js"

export * from "./getFinalize.js"
export * from "./getPartialControl.js"
export * from "./getPartialOrm.js"
export * from "./isISO8601DatetimeString.js"
export * from "./types.js"

export function datetime<TRequired extends boolean = false>(
  props?: PartialDatetimeProps<TRequired>,
): PartialAttribute<
  PartialDatetimeORM,
  PartialDatetimeControlType<TRequired>,
  Date,
  FinalDatetimeORM
> {
  return {
    name: `datetime(${props ? JSON.stringify(props) : ""})`,
    orm: getPartialOrm(props),
    control: getPartialControl(props),
    finalize: function finalizeDatetime() {
      return getFinalize(this)
    },
  }
}
