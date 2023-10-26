import { getFinalize } from "./getFinalize"
import { getPartialControl } from "./getPartialControl"
import { getPartialOrm } from "./getPartialOrm"
import type {
  FinalUuidORM,
  PartialUuidControlType,
  PartialUuidORM,
  PartialUuidProps,
} from "./types"
import type { PartialAttribute } from "../../types"

export function uuid<TRequired extends boolean = false>(
  props?: PartialUuidProps<TRequired>,
): PartialAttribute<
  PartialUuidORM,
  PartialUuidControlType<TRequired>,
  string,
  FinalUuidORM
> {
  return {
    name: `uuid(${props ? JSON.stringify(props) : ""})`,
    orm: getPartialOrm(props),
    control: getPartialControl(props),
    finalize: function finalizeUuid() {
      return getFinalize(this)
    },
  }
}
