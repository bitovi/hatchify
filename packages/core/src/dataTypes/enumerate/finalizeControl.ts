import type { PartialEnumControlType } from "./types"

export function finalizeControl(
  props: Omit<PartialEnumControlType, "allowNullInfer">,
): Required<Omit<PartialEnumControlType, "allowNullInfer">> {
  return {
    ...props,
    allowNull: props.allowNull !== false && !props.primary,
    primary: !!props.primary,
    default: props.default ?? null,
  }
}
