import type { FinalTextORM, PartialTextORM } from "./types"

export function finalizeOrm({ sequelize }: PartialTextORM): FinalTextORM {
  return {
    sequelize: {
      ...sequelize,
      allowNull: sequelize.allowNull !== false && !sequelize.primaryKey,
      primaryKey: !!sequelize.primaryKey,
      defaultValue: sequelize.defaultValue ?? null,
      unique: !!sequelize.unique || !!sequelize.primaryKey,
      maxDisplayLength: sequelize.maxDisplayLength ?? null,
    },
  }
}
