import { getFinalize } from "./getFinalize"
import { getPartialControl } from "./getPartialControl"
import { getPartialOrm } from "./getPartialOrm"
import type {
  FinalDatetimeORM,
  PartialDatetimeControlType,
  PartialDatetimeORM,
  PartialDatetimeProps,
} from "./types"
import type { PartialAttribute } from "../../types"

export * from "./getFinalize"
export * from "./getPartialControl"
export * from "./getPartialOrm"
export * from "./types"

export function datetime(
  props?: PartialDatetimeProps,
): PartialAttribute<
  PartialDatetimeORM,
  PartialDatetimeControlType,
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
