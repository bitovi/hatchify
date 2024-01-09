import type { PartialStringControlType } from "./types.js"

export function finalizeControl(
  props: Omit<PartialStringControlType<boolean>, "allowNullInfer">,
): Required<Omit<PartialStringControlType<boolean>, "allowNullInfer">> {
  // @ts-expect-error @todo HATCH-417
  delete props.allowNullInfer
  return {
    ...props,
    allowNull: props.allowNull !== false && !props.primary,
    min: props.min ?? 0,
    max: props.max ?? 255,
    primary: !!props.primary,
    default: props.default ?? null,
    regex: props.regex ?? /(.*?)/,
    ui: {
      maxDisplayLength: props?.ui?.maxDisplayLength ?? null,
      displayName: props?.ui?.displayName ?? null,
    },
  }
}
