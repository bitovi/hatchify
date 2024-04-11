import type { PartialBooleanControlType } from "./types.js"

export function finalizeControl(
  props: Omit<PartialBooleanControlType<boolean>, "allowNullInfer">,
): Required<Omit<PartialBooleanControlType<boolean>, "allowNullInfer">> {
  // @ts-expect-error @todo HATCH-417
  delete props.allowNullInfer
  return {
    ...props,
    allowNull: props.allowNull !== false,
    primary: !!props.primary,
    default: props.default ?? null,
    ui: {
      displayName: props?.ui?.displayName ?? null,
      hidden: props.hidden ?? false,
    },
  }
}
