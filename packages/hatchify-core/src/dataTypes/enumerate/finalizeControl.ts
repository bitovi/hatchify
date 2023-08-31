import type { PartialEnumControlType } from "./types"

export function finalizeControl(
  props: PartialEnumControlType,
): Required<PartialEnumControlType> {
  return {
    ...props,
    allowNull: props.allowNull !== false && !props.primary,
    primary: !!props.primary,
  }
}
