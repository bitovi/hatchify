import { getFinalize } from "./getFinalize"
import { getPartialControl } from "./getPartialControl"
import { getPartialOrm } from "./getPartialOrm"
import type {
  FinalBooleanORM,
  PartialBooleanControlType,
  PartialBooleanORM,
  PartialBooleanProps,
} from "./types"
import type { PartialAttribute } from "../../types"

export * from "./getFinalize"
export * from "./getPartialControl"
export * from "./getPartialOrm"
export * from "./types"

export function boolean(
  props?: PartialBooleanProps,
): PartialAttribute<
  PartialBooleanORM,
  PartialBooleanControlType,
  boolean,
  FinalBooleanORM
> {
  return {
    name: `boolean(${props ? JSON.stringify(props) : ""})`,
    orm: getPartialOrm(props),
    control: getPartialControl(props),
    finalize: function finalizeBoolean() {
      return getFinalize(this)
    },
  }
}
