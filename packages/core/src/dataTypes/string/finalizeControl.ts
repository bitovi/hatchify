import type { PartialStringControlType } from "./types"

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
    maxDisplayLength: props?.maxDisplayLength ?? 255,
  }
}
