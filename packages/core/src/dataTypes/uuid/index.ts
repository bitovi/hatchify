import { getFinalize } from "./getFinalize"
import { getPartialControl } from "./getPartialControl"
import { getPartialOrm } from "./getPartialOrm"
import type { FinalUuidORM, PartialUuidORM, PartialUuidProps } from "./types"
import type { PartialAttribute } from "../../types"
import type { PartialStringControlType } from "../string"

export function uuid<TRequired extends boolean = false>(
  props?: PartialUuidProps<TRequired>,
): PartialAttribute<
  PartialUuidORM,
  PartialStringControlType<TRequired>,
  string,
  FinalUuidORM
> {
  return {
    name: `uuid(${props ? JSON.stringify(props) : ""})`,
    orm: getPartialOrm(props),
    control: getPartialControl(props),
    finalize: function finalizeString() {
      return getFinalize(this)
    },
  }
}
