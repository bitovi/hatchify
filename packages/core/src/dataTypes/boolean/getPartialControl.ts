import type { PartialBooleanControlType, PartialBooleanProps } from "./types.js"

export function getPartialControl<TRequired extends boolean>(
  props?: PartialBooleanProps<TRequired>,
): PartialBooleanControlType<TRequired> {
  return {
    type: "Boolean",
    allowNull: props?.required == null ? props?.required : !props.required,
    allowNullInfer: (props?.required == null
      ? props?.required
      : !props.required) as TRequired extends true ? false : true,
    default: props?.default,
    displayName: props?.displayName,
  }
}
