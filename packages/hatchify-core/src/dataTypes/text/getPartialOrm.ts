import type { PartialTextORM, PartialTextProps } from "./types"

export function getPartialOrm(props?: PartialTextProps): PartialTextORM {
  return {
    sequelize: {
      type: "TEXT",
      allowNull: props?.required == null ? props?.required : !props.required,
      primaryKey: props?.primary,
    },
  }
}
