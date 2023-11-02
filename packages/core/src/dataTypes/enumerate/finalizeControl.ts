import type { PartialEnumControlType } from "./types"

export function finalizeControl(
  props: Omit<PartialEnumControlType<boolean>, "allowNullInfer">,
): Required<Omit<PartialEnumControlType<boolean>, "allowNullInfer">> {
  // @ts-expect-error @todo HATCH-417
  delete props.allowNullInfer
  return {
    ...props,
    allowNull: props.allowNull !== false && !props.primary,
    primary: !!props.primary,
    default: props.default ?? null,
  }
}
