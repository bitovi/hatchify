import type { FinalUuidORM, PartialUuidORM } from "./types.js"

export function finalizeOrm({ sequelize }: PartialUuidORM): FinalUuidORM {
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
