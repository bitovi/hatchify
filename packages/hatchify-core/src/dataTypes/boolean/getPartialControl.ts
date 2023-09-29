import type { PartialBooleanControlType, PartialBooleanProps } from "./types"

export function getPartialControl(
  props?: PartialBooleanProps,
): PartialBooleanControlType {
  return {
    type: "Boolean",
    allowNull: props?.required == null ? props?.required : !props.required,
    default: props?.default,
  }
}
