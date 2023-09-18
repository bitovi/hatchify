import type { PartialBooleanControlType } from "./types"

export function finalizeControl(
  props: PartialBooleanControlType,
): Required<PartialBooleanControlType> {
  return {
    ...props,
    allowNull: props.allowNull !== false,
  }
}
