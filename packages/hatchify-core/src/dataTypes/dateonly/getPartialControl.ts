import type { PartialDateonlyControlType, PartialDateonlyProps } from "./types"

export function getPartialControl(
  props?: PartialDateonlyProps,
): PartialDateonlyControlType {
  return {
    type: "Dateonly",
    allowNull: props?.required == null ? props?.required : !props.required,
    min: props?.min,
    max: props?.max,
    primary: props?.primary,
    default: props?.default,
  }
}
