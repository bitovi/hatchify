import type { PartialBooleanORM, PartialBooleanProps } from "./types"

export function getPartialOrm(props?: PartialBooleanProps): PartialBooleanORM {
  return {
    sequelize: {
      type: "BOOLEAN",
      allowNull: props?.required == null ? props?.required : !props.required,
      defaultValue: props?.default,
    },
  }
}
