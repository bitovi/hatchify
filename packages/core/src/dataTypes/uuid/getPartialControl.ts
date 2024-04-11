import { UUID_REGEX } from "./constants.js"
import type { PartialUuidControlType, PartialUuidProps } from "./types.js"

export function getPartialControl<TRequired extends boolean>(
  props?: PartialUuidProps<TRequired>,
): PartialUuidControlType<TRequired> {
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
    ui: {
      displayName: props?.ui?.displayName,
      hidden: props?.ui?.hidden ?? false,
    },
  }
}
