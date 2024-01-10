import { getFinalize } from "./getFinalize.js"
import { getPartialControl } from "./getPartialControl.js"
import { getPartialOrm } from "./getPartialOrm.js"
import type {
  FinalUuidORM,
  PartialUuidControlType,
  PartialUuidORM,
  PartialUuidProps,
} from "./types.js"
import type { PartialAttribute } from "../../types/index.js"

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
