import type { PartialStringControlType, PartialStringProps } from "./types"

export function getPartialControl(
  props?: PartialStringProps,
): PartialStringControlType {
  return {
    type: "String",
    allowNull: props?.required == null ? props?.required : !props.required,
    min: props?.min,
    max: props?.max,
    primary: props?.primary,
  }
}
