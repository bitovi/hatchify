import type { PartialDatetimeControlType } from "./types"

export function finalizeControl(
  props: PartialDatetimeControlType,
): Required<PartialDatetimeControlType> {
  return {
    ...props,
    allowNull: props.allowNull !== false && !props.primary,
    min: props.min ?? -Infinity,
    max: props.max ?? Infinity,
    primary: !!props.primary,
    step: props.step || 0,
  }
}
