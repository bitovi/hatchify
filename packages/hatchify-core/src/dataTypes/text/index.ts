import { getFinalize } from "./getFinalize"
import { getPartialControl } from "./getPartialControl"
import { getPartialOrm } from "./getPartialOrm"
import type {
  FinalTextORM,
  PartialTextControlType,
  PartialTextORM,
  PartialTextProps,
} from "./types"
import type { PartialAttribute } from "../../types"

export function text(
  props?: PartialTextProps,
): PartialAttribute<
  PartialTextORM,
  PartialTextControlType,
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
