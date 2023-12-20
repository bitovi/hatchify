import type { PartialDateonlyControlType } from "./types"

export function finalizeControl(
  props: Omit<PartialDateonlyControlType<boolean>, "allowNullInfer">,
): Required<
  Omit<
    PartialDateonlyControlType<boolean>,
    "allowNullInfer" | "displayName"
  > & { displayName: PartialDateonlyControlType<boolean>["displayName"] }
> {
  // @ts-expect-error @todo HATCH-417
  delete props.allowNullInfer
  return {
    ...props,
    allowNull: props.allowNull !== false && !props.primary,
    min: props.min ?? -Infinity,
    max: props.max ?? Infinity,
    primary: !!props.primary,
    default: props.default ?? null,
    displayName: props.displayName ?? undefined,
  }
}
