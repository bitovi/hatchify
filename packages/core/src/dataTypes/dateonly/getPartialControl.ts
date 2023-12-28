import type { PartialDateonlyControlType, PartialDateonlyProps } from "./types"

export function getPartialControl<TRequired extends boolean>(
  props?: PartialDateonlyProps<TRequired>,
): PartialDateonlyControlType<TRequired> {
  return {
    type: "Dateonly",
    allowNull: props?.required == null ? props?.required : !props.required,
    allowNullInfer: (props?.required == null
      ? props?.required
      : !props.required) as TRequired extends true ? false : true,
    min: props?.min,
    max: props?.max,
    primary: props?.primary,
    default: props?.default,
  }
}
