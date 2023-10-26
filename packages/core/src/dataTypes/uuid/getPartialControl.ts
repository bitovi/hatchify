import { UUID_REGEX } from "./constants"
import type { PartialUuidControlType, PartialUuidProps } from "./types"

export function getPartialControl<TRequired extends boolean>(
  props?: PartialUuidProps<TRequired>,
): PartialUuidControlType<TRequired> {
  return {
    type: "String",
    references: props?.references ?? null,
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
