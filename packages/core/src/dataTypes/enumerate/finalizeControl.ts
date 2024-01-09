import type { PartialEnumControlType } from "./types.js"

export function finalizeControl<TValues extends readonly string[]>(
  props: Omit<PartialEnumControlType<boolean, TValues>, "allowNullInfer">,
): Required<Omit<PartialEnumControlType<boolean, TValues>, "allowNullInfer">> {
  // @ts-expect-error @todo HATCH-417
  delete props.allowNullInfer
  return {
    ...props,
    allowNull: props.allowNull !== false && !props.primary,
    primary: !!props.primary,
    default: props.default ?? null,
    ui: {
      displayName: props?.ui?.displayName ?? null,
    },
  }
}
