import type { PartialTextControlType } from "./types.js"

export function finalizeControl(
  props: Omit<PartialTextControlType<boolean>, "allowNullInfer">,
): Required<Omit<PartialTextControlType<boolean>, "allowNullInfer">> {
  // @ts-expect-error @todo HATCH-417
  delete props.allowNullInfer
  return {
    ...props,
    allowNull: props.allowNull !== false && !props.primary,
    min: props.min ?? 0,
    max: props.max ?? Infinity,
    primary: !!props.primary,
    default: props.default ?? null,
    regex: props.regex ?? /(.*?)/,
    ui: {
      enableCaseSensitiveContains:
        props.ui?.enableCaseSensitiveContains ?? false,
      displayName: props?.ui?.displayName ?? null,
      maxDisplayLength: props?.ui?.maxDisplayLength ?? null,
      maxRenderLength: props?.ui?.maxRenderLength ?? null,
      hidden: props?.ui?.hidden ?? false,
    },
  }
}
