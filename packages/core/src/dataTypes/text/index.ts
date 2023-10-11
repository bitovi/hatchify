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
    // @ts-expect-error
    finalize: function finalizeText() {
      return getFinalize(this)
    },
  }
}
