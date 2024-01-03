import type { PartialEnumORM, PartialEnumProps } from "./types.js"
import { validateValues } from "./validateValues.js"
import { HatchifyInvalidSchemaError } from "../../types/index.js"

export function getPartialOrm(
  // @todo HATCH-417
  props: PartialEnumProps<boolean, any>,
): PartialEnumORM {
  if (!validateValues(props.values)) {
    throw new HatchifyInvalidSchemaError(
      "enum must be called with values as a non-empty string array",
    )
  }

  return {
    sequelize: {
      type: "ENUM",
      typeArgs: props.values,
      allowNull: props?.required == null ? props?.required : !props.required,
      primaryKey: props?.primary,
      defaultValue: props?.default,
      unique: props?.unique,
    },
  }
}
