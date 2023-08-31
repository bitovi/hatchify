import { getPartialControl } from "./getPartialControl"
import { getPartialOrm } from "./getPartialOrm"
import type { PartialAttribute } from "../../types"
import { getFinalize } from "../string"
import type {
  FinalStringORM,
  PartialStringControlType,
  PartialStringORM,
  PartialStringProps,
} from "../string"

export function text(
  props?: PartialStringProps,
): PartialAttribute<
  PartialStringORM,
  PartialStringControlType,
  string,
  FinalStringORM
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
