import { getFinalize } from "./getFinalize.js"
import { getPartialControl } from "./getPartialControl.js"
import { getPartialOrm } from "./getPartialOrm.js"
import type {
  FinalTextORM,
  PartialTextControlType,
  PartialTextORM,
  PartialTextProps,
} from "./types.js"
import type { PartialAttribute } from "../../types/index.js"

export function text<TRequired extends boolean = false>(
  props?: PartialTextProps<TRequired>,
): PartialAttribute<
  PartialTextORM,
  PartialTextControlType<TRequired>,
  string,
  FinalTextORM
> {
  return {
    name: `text(${props ? JSON.stringify(props) : ""})`,
    orm: getPartialOrm(props),
    control: getPartialControl(props),
    finalize: function finalizeText() {
      return getFinalize(this)
    },
  }
}
