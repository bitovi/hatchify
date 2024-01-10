import { getFinalize } from "./getFinalize.js"
import { getPartialControl } from "./getPartialControl.js"
import { getPartialOrm } from "./getPartialOrm.js"
import type {
  FinalBooleanORM,
  PartialBooleanControlType,
  PartialBooleanORM,
  PartialBooleanProps,
} from "./types.js"
import type { PartialAttribute } from "../../types/index.js"

export * from "./getFinalize.js"
export * from "./getPartialControl.js"
export * from "./getPartialOrm.js"
export * from "./types.js"

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
