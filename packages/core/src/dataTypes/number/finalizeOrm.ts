import type { FinalNumberORM, PartialNumberORM } from "./types.js"

export function finalizeOrm({ sequelize }: PartialNumberORM): FinalNumberORM {
  return {
    sequelize: {
      ...sequelize,
      allowNull: sequelize.allowNull !== false && !sequelize.primaryKey,
      autoIncrement: !!sequelize.autoIncrement,
      primaryKey: !!sequelize.primaryKey,
      defaultValue: sequelize.defaultValue ?? null,
      unique: !!sequelize.unique || !!sequelize.primaryKey,
    },
  }
}
