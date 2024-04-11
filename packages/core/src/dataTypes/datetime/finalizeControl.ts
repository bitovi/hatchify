import type { PartialDatetimeControlType } from "./types.js"

export function finalizeControl(
  props: Omit<PartialDatetimeControlType<boolean>, "allowNullInfer">,
): Required<Omit<PartialDatetimeControlType<boolean>, "allowNullInfer">> {
  // @ts-expect-error @todo HATCH-417
  delete props.allowNullInfer
  return {
    ...props,
    allowNull: props.allowNull !== false && !props.primary,
    min: props.min ?? -Infinity,
    max: props.max ?? Infinity,
    primary: !!props.primary,
    default: props.default ?? null,
    step: props.step || 0,
    ui: {
      displayName: props?.ui?.displayName ?? null,
      hidden: props?.ui?.hidden ?? false,
    },
  }
}
