import type { FinalEnumORM, PartialEnumORM } from "./types.js"

export function finalizeOrm({ sequelize }: PartialEnumORM): FinalEnumORM {
  return {
    sequelize: {
      ...sequelize,
      allowNull: sequelize.allowNull !== false && !sequelize.primaryKey,
      primaryKey: !!sequelize.primaryKey,
      defaultValue: sequelize.defaultValue ?? null,
      unique: !!sequelize.unique || !!sequelize.primaryKey,
    },
  }
}
