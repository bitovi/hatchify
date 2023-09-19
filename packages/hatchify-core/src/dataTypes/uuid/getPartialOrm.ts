import type { PartialUuidORM, PartialUuidProps } from "./types"

export function getPartialOrm(props?: PartialUuidProps): PartialUuidORM {
  return {
    sequelize: {
      type: "UUID",
      allowNull: props?.required == null ? props?.required : !props.required,
      primaryKey: props?.primary,
    },
  }
}
