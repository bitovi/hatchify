import type { PartialNumberORM, PartialNumberProps } from "./types"

export function getPartialOrm(props?: PartialNumberProps): PartialNumberORM {
  return {
    sequelize: {
      type: "DOUBLE",
      typeArgs: [],
      allowNull: props?.required == null ? props?.required : !props.required,
      autoIncrement: props?.autoIncrement,
      primaryKey: props?.primary,
    },
  }
}
