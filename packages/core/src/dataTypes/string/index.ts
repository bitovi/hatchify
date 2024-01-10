import { getFinalize } from "./getFinalize.js"
import { getPartialControl } from "./getPartialControl.js"
import { getPartialOrm } from "./getPartialOrm.js"
import type {
  FinalStringORM,
  PartialStringControlType,
  PartialStringORM,
  PartialStringProps,
} from "./types.js"
import type { PartialAttribute } from "../../types/index.js"

export * from "./getFinalize.js"
export * from "./getPartialControl.js"
export * from "./getPartialOrm.js"
export * from "./types.js"

export function string<TRequired extends boolean = false>(
  props?: PartialStringProps<TRequired>,
): PartialAttribute<
  PartialStringORM,
  PartialStringControlType<TRequired>,
  string,
  FinalStringORM
> {
  return {
    name: `string(${
      props ? JSON.stringify({ ...props, regex: props.regex?.toString() }) : ""
    })`,
    orm: getPartialOrm(props),
    control: getPartialControl(props),
    finalize: function finalizeString() {
      return getFinalize(this)
    },
  }
}
