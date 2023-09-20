import type { FinalEnumORM, PartialEnumORM } from "./types"

export function finalizeOrm({ sequelize }: PartialEnumORM): FinalEnumORM {
  return {
    sequelize: {
      ...sequelize,
      allowNull: sequelize.allowNull !== false && !sequelize.primaryKey,
      primaryKey: !!sequelize.primaryKey,
      defaultValue: sequelize.defaultValue ?? null,
    },
  }
}
