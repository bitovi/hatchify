import { getFinalize } from "./getFinalize"
import { getPartialControl } from "./getPartialControl"
import { getPartialOrm } from "./getPartialOrm"
import type {
  FinalStringORM,
  PartialStringControlType,
  PartialStringORM,
  PartialStringProps,
} from "./types"
import type { PartialAttribute } from "../../types"

export * from "./getFinalize"
export * from "./getPartialControl"
export * from "./getPartialOrm"
export * from "./types"

export function string(
  props?: PartialStringProps,
): PartialAttribute<
  PartialStringORM,
  PartialStringControlType,
  string,
  FinalStringORM
> {
  return {
    name: `string(${props ? JSON.stringify(props) : ""})`,
    orm: getPartialOrm(props),
    control: getPartialControl(props),
    finalize: function finalizeString() {
      return getFinalize(this)
    },
  }
}
