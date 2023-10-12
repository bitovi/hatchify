import type { PartialBooleanControlType } from "./types"

export function finalizeControl(
  props: Omit<PartialBooleanControlType<boolean>, "allowNullInfer">,
): Required<Omit<PartialBooleanControlType<boolean>, "allowNullInfer">> {
  // @ts-ignore
  delete props.allowNullInfer
  return {
    ...props,
    allowNull: props.allowNull !== false,
    default: props.default ?? null,
  }
}
