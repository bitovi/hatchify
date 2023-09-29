import type { PartialTextControlType } from "./types"

export function finalizeControl(
  props: PartialTextControlType,
): Required<PartialTextControlType> {
  return {
    ...props,
    allowNull: props.allowNull !== false && !props.primary,
    min: props.min ?? 0,
    max: props.max ?? 255,
    primary: !!props.primary,
    default: props.default ?? null,
    regex: props.regex ?? /(.*?)/,
  }
}
