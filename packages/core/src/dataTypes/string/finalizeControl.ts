import type { PartialStringControlType } from "./types"

export function finalizeControl(
  props: PartialStringControlType,
): Required<PartialStringControlType> {
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
