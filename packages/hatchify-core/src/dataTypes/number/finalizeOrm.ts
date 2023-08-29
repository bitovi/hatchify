import type { FinalNumberORM, PartialNumberORM } from "./types"

export function finalizeOrm({ sequelize }: PartialNumberORM): FinalNumberORM {
  return {
    sequelize: {
      ...sequelize,
      allowNull: sequelize.allowNull !== false && !sequelize.primaryKey,
      autoIncrement: !!sequelize.autoIncrement,
      primaryKey: !!sequelize.primaryKey,
    },
  }
}
