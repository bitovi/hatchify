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

export function boolean<TRequired extends boolean = false>(
  props?: PartialBooleanProps<TRequired>,
): PartialAttribute<
  PartialBooleanORM,
  PartialBooleanControlType<TRequired>,
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
