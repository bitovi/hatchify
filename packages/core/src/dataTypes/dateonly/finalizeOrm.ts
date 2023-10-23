import type { FinalDateonlyORM, PartialDateonlyORM } from "./types"

export function finalizeOrm({
  sequelize,
}: PartialDateonlyORM): FinalDateonlyORM {
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
