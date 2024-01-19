import type { PartialUuidControlType } from "./types.js"

export function finalizeControl(
  props: Omit<PartialUuidControlType<boolean>, "allowNullInfer">,
): Required<Omit<PartialUuidControlType<boolean>, "allowNullInfer">> {
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
  }
}
