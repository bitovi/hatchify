import type { FinalDatetimeORM, PartialDatetimeORM } from "./types.js"

export function finalizeOrm({
  sequelize,
}: PartialDatetimeORM): FinalDatetimeORM {
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
