import type { PartialNumberControlType } from "./types.js"

export function finalizeControl(
  props: Omit<PartialNumberControlType<boolean>, "allowNullInfer">,
): Required<Omit<PartialNumberControlType<boolean>, "allowNullInfer">> {
  // @ts-expect-error @todo HATCH-417
  delete props.allowNullInfer
  return {
    ...props,
    allowNull: props.allowNull !== false && !props.primary,
    min: props.min ?? -Infinity,
    max: props.max ?? Infinity,
    primary: !!props.primary,
    step: props.step || 0,
    default: props.default ?? null,
    displayName: props.displayName ?? null,
    hidden: props.hidden ?? false,
    readOnly: props.readOnly ?? false,
  }
}
