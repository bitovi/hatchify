import type { PartialDateonlyControlType } from "./types.js"

export function finalizeControl(
  props: Omit<PartialDateonlyControlType<boolean>, "allowNullInfer">,
): Required<Omit<PartialDateonlyControlType<boolean>, "allowNullInfer">> {
  // @ts-expect-error @todo HATCH-417
  delete props.allowNullInfer
  return {
    ...props,
    allowNull: props.allowNull !== false && !props.primary,
    min: props.min ?? -Infinity,
    max: props.max ?? Infinity,
    primary: !!props.primary,
    default: props.default ?? null,
    ui: {
      displayName: props?.ui?.displayName ?? null,
    },
  }
}
