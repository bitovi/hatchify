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

export function enumerate<
  // @todo HATCH-417
  TRequired extends boolean = false,
  const TValues extends readonly string[] = string[],
>(
  props: PartialEnumProps<TRequired, TValues>,
): PartialAttribute<
  PartialEnumORM,
  PartialEnumControlType<TRequired, TValues>,
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
