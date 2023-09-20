import type { PartialDatetimeControlType, PartialDatetimeProps } from "./types"

export function getPartialControl(
  props?: PartialDatetimeProps,
): PartialDatetimeControlType {
  return {
    type: "Datetime",
    allowNull: props?.required == null ? props?.required : !props.required,
    min: props?.min,
    max: props?.max,
    primary: props?.primary,
    step: props?.step,
    default: props?.default,
  }
}
