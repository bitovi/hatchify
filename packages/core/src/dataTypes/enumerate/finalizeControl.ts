import type { PartialEnumControlType } from "./types"

export function finalizeControl<TValues extends readonly string[]>(
  props: Omit<PartialEnumControlType<boolean, TValues>, "allowNullInfer">,
): Required<
  Omit<
    PartialEnumControlType<boolean, TValues>,
    "allowNullInfer" | "displayName"
  > & { displayName: PartialEnumControlType<boolean, TValues>["displayName"] }
> {
  // @ts-expect-error @todo HATCH-417
  delete props.allowNullInfer
  return {
    ...props,
    allowNull: props.allowNull !== false && !props.primary,
    primary: !!props.primary,
    default: props.default ?? null,
    displayName: props.displayName ?? undefined,
  }
}
