import { getFinalize } from "./getFinalize"
import { getPartialControl } from "./getPartialControl"
import { getPartialOrm } from "./getPartialOrm"
import type {
  FinalEnumORM,
  PartialEnumControlType,
  PartialEnumORM,
  PartialEnumProps,
} from "./types"
import type { PartialAttribute } from "../../types"

export function enumerate(
  props: PartialEnumProps,
): PartialAttribute<
  PartialEnumORM,
  PartialEnumControlType,
  string,
  FinalEnumORM
> {
  return {
    name: `enumerate(${JSON.stringify(props)})`,
    orm: getPartialOrm(props),
    control: getPartialControl(props),
    // @ts-expect-error
    finalize: function finalizeText() {
      return getFinalize(this)
    },
  }
}
