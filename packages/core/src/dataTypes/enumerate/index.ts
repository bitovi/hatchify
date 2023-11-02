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

export function enumerate<TRequired extends boolean = false>(
  props: PartialEnumProps<TRequired>,
): PartialAttribute<
  PartialEnumORM,
  PartialEnumControlType<TRequired>,
  string,
  FinalEnumORM
> {
  return {
    name: `enumerate(${JSON.stringify(props)})`,
    orm: getPartialOrm(props),
    control: getPartialControl(props),
    finalize: function finalizeEnumerate() {
      return getFinalize(this)
    },
  }
}
