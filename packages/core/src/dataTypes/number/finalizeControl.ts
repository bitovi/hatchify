import type { PartialNumberControlType } from "./types"

export function finalizeControl(
  props: Omit<PartialNumberControlType<boolean>, "allowNullInfer">,
): Required<Omit<PartialNumberControlType<boolean>, "allowNullInfer">> {
  return {
    ...props,
    allowNull: props.allowNull !== false && !props.primary,
    min: props.min ?? -Infinity,
    max: props.max ?? Infinity,
    primary: !!props.primary,
    step: props.step || 0,
    default: props.default ?? null,
  }
}
