import type { FinalTextORM, PartialTextORM } from "./types.js"

export function finalizeOrm({ sequelize }: PartialTextORM): FinalTextORM {
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
