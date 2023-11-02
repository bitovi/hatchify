import type { PartialEnumORM, PartialEnumProps } from "./types"
import { validateValues } from "./validateValues"
import { HatchifyInvalidSchemaError } from "../../types"

export function getPartialOrm(
  props: PartialEnumProps<boolean>,
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
