import type { PartialNumberControlType, PartialNumberProps } from "./types.js"

export function getPartialControl<TRequired extends boolean>(
  props?: PartialNumberProps<TRequired>,
): PartialNumberControlType<TRequired> {
  return {
    type: "Number",
    allowNull: props?.required == null ? props?.required : !props.required,
    allowNullInfer: (props?.required == null
      ? props?.required
      : !props.required) as TRequired extends true ? false : true,
    min: props?.min,
    max: props?.max,
    primary: props?.primary,
    step: props?.step,
    default: props?.default,
    readOnly: props?.readOnly,
    ui: {
      displayName: props?.ui?.displayName,
      hidden: props?.ui?.hidden,
    },
  }
}
