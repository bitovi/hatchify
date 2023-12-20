import type { PartialBooleanControlType } from "./types"

export function finalizeControl(
  props: Omit<PartialBooleanControlType<boolean>, "allowNullInfer">,
): Required<
  Omit<PartialBooleanControlType<boolean>, "allowNullInfer" | "displayName">
> & { displayName: PartialBooleanControlType<boolean>["displayName"] } {
  // @ts-expect-error @todo HATCH-417
  delete props.allowNullInfer
  return {
    ...props,
    allowNull: props.allowNull !== false,
    default: props.default ?? null,
    displayName: props.displayName ?? undefined,
  }
}
