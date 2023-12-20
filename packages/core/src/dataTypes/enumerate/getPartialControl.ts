import type { PartialEnumControlType, PartialEnumProps } from "./types"
import { validateValues } from "./validateValues"
import { HatchifyInvalidSchemaError } from "../../types"

export function getPartialControl<
  // @todo HATCH-417
  TRequired extends boolean,
  const TValues extends readonly string[],
>(
  props: PartialEnumProps<TRequired, TValues>,
): PartialEnumControlType<TRequired, TValues> {
  if (!validateValues(props.values)) {
    throw new HatchifyInvalidSchemaError(
      "enum must be called with values as a non-empty string array",
    )
  }

  return {
    type: "enum",
    allowNull: props?.required == null ? props?.required : !props.required,
    allowNullInfer: (props?.required == null
      ? props?.required
      : !props.required) as TRequired extends true ? false : true,
    primary: props?.primary,
    default: props?.default,
    values: props.values,
    displayName: props?.displayName || undefined,
  }
}
