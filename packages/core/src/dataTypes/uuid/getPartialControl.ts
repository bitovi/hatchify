import { UUID_REGEX } from "./constants"
import type { PartialUuidProps } from "./types"
import type { PartialStringControlType } from "../string"

export function getPartialControl<TRequired extends boolean>(
  props?: PartialUuidProps<TRequired>,
): PartialStringControlType<TRequired> {
  return {
    type: "String",
    allowNull: props?.required == null ? props?.required : !props.required,
    allowNullInfer: (props?.required == null
      ? props?.required
      : !props.required) as TRequired extends true ? false : true,
    min: 36,
    max: 36,
    primary: props?.primary,
    default: props?.default,
    regex: UUID_REGEX,
  }
}
