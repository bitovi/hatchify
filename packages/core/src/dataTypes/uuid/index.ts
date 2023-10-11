import { getFinalize } from "./getFinalize"
import { getPartialControl } from "./getPartialControl"
import { getPartialOrm } from "./getPartialOrm"
import type { FinalUuidORM, PartialUuidORM, PartialUuidProps } from "./types"
import type { PartialAttribute } from "../../types"
import type { PartialStringControlType } from "../string"

export function uuid(
  props?: PartialUuidProps,
): PartialAttribute<
  PartialUuidORM,
  PartialStringControlType<true>,
  string,
  FinalUuidORM
> {
  return {
    name: `uuid(${props ? JSON.stringify(props) : ""})`,
    orm: getPartialOrm(props),
    control: getPartialControl(props),
    // @ts-expect-error
    finalize: function finalizeString() {
      return getFinalize(this)
    },
  }
}
