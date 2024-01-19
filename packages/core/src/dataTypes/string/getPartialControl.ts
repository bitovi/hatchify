import type { PartialStringControlType, PartialStringProps } from "./types.js"

export function getPartialControl<TRequired extends boolean>(
  props?: PartialStringProps<TRequired>,
): PartialStringControlType<TRequired> {
  return {
    type: "String",
    allowNull: props?.required == null ? props?.required : !props.required,
    allowNullInfer: (props?.required == null
      ? props?.required
      : !props.required) as TRequired extends true ? false : true,
    min: props?.min,
    max: props?.max,
    primary: props?.primary,
    default: props?.default,
    regex: props?.regex,
    ui: {
      maxDisplayLength: props?.ui?.maxDisplayLength,
      displayName: props?.ui?.displayName,
    },
  }
}
