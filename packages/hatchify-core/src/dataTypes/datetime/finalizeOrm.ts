import type { FinalDatetimeORM, PartialDatetimeORM } from "./types"

export function finalizeOrm({
  sequelize,
}: PartialDatetimeORM): FinalDatetimeORM {
  return {
    sequelize: {
      ...sequelize,
      allowNull: sequelize.allowNull !== false && !sequelize.primaryKey,
      primaryKey: !!sequelize.primaryKey,
    },
  }
}
