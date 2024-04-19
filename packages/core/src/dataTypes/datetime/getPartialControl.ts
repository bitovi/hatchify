import type {
  PartialDatetimeControlType,
  PartialDatetimeProps,
} from "./types.js"

export function getPartialControl<TRequired extends boolean>(
  props?: PartialDatetimeProps<TRequired>,
): PartialDatetimeControlType<TRequired> {
  return {
    type: "Date",
    allowNull: props?.required == null ? props?.required : !props.required,
    allowNullInfer: (props?.required == null
      ? props?.required
      : !props.required) as TRequired extends true ? false : true,
    min: props?.min,
    max: props?.max,
    primary: props?.primary,
    step: props?.step,
    default: props?.default,
    ui: {
      displayName: props?.ui?.displayName,
      hidden: props?.ui?.hidden,
    },
  }
}
