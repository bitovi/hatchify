import type { FinalUuidORM, PartialUuidORM } from "./types"

export function finalizeOrm({ sequelize }: PartialUuidORM): FinalUuidORM {
  return {
    sequelize: {
      ...sequelize,
      allowNull: sequelize.allowNull !== false && !sequelize.primaryKey,
      primaryKey: !!sequelize.primaryKey,
      defaultValue: sequelize.defaultValue ?? null,
    },
  }
}
