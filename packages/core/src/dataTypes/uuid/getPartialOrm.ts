import type { PartialUuidORM, PartialUuidProps } from "./types.js"

export function getPartialOrm(
  props?: PartialUuidProps<boolean>,
): PartialUuidORM {
  return {
    sequelize: {
      type: "UUID",
      allowNull: props?.required == null ? props?.required : !props.required,
      primaryKey: props?.primary,
      defaultValue: props?.default,
      unique: props?.unique,
    },
  }
}
