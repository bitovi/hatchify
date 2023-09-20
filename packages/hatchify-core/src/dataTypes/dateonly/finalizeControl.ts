import type { PartialDateonlyControlType } from "./types"

export function finalizeControl(
  props: PartialDateonlyControlType,
): Required<PartialDateonlyControlType> {
  return {
    ...props,
    allowNull: props.allowNull !== false && !props.primary,
    min: props.min ?? -Infinity,
    max: props.max ?? Infinity,
    primary: !!props.primary,
    default: props.default ?? null,
  }
}
