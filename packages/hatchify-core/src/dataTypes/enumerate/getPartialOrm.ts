import type { PartialEnumORM, PartialEnumProps } from "./types"
import { validateValues } from "./validateValues"
import { HatchifyInvalidInputError } from "../../types"

export function getPartialOrm(props: PartialEnumProps): PartialEnumORM {
  if (!validateValues(props.values)) {
    throw new HatchifyInvalidInputError(
      "enum must be called with values as a non-empty string array",
    )
  }

  return {
    sequelize: {
      type: "ENUM",
      typeArgs: props.values,
      allowNull: props?.required == null ? props?.required : !props.required,
      primaryKey: props?.primary,
    },
  }
}
