import { UUID_REGEX } from "./constants"
import type { PartialUuidProps } from "./types"
import type { PartialStringControlType } from "../string"

export function getPartialControl(
  props?: PartialUuidProps,
): PartialStringControlType {
  return {
    type: "String",
    allowNull: props?.required == null ? props?.required : !props.required,
    min: 36,
    max: 36,
    primary: props?.primary,
    regex: UUID_REGEX,
  }
}
