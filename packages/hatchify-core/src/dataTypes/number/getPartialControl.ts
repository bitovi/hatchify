import type { PartialNumberControlType, PartialNumberProps } from "../../types"

export function getPartialControl(
  props?: PartialNumberProps,
): PartialNumberControlType {
  return {
    type: "Number",
    allowNull: props?.required == null ? props?.required : !props.required,
    min: props?.min,
    max: props?.max,
    primary: props?.primary,
    step: props?.step,
  }
}
