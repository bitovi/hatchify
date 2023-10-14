import { UUID_REGEX } from "./constants"
import type { PartialUuidProps } from "./types"
import type { PartialStringControlType } from "../string"

export function getPartialControl(
  props?: PartialUuidProps,
): PartialStringControlType<boolean> {
  return {
    type: "String",
    allowNull: props?.required == null ? props?.required : !props.required,
    allowNullInfer: (props?.required == null
      ? props?.required
      : !props.required) as boolean,
    min: 36,
    max: 36,
    primary: props?.primary,
    default: props?.default,
    regex: UUID_REGEX,
  }
}
