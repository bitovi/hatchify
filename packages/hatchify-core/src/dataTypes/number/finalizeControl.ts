import type { PartialNumberControlType } from "../../types"

export function finalizeControl(
  props: PartialNumberControlType,
): Required<PartialNumberControlType> {
  return {
    ...props,
    allowNull: props.allowNull !== false && !props.primary,
    min: props.min ?? -Infinity,
    max: props.max ?? Infinity,
    primary: !!props.primary,
    step: props.step || 0,
  }
}
