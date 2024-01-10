import type { FinalBooleanORM, PartialBooleanORM } from "./types.js"

export function finalizeOrm({ sequelize }: PartialBooleanORM): FinalBooleanORM {
  return {
    sequelize: {
      ...sequelize,
      allowNull: sequelize.allowNull !== false,
      defaultValue: sequelize.defaultValue ?? null,
      unique: !!sequelize.unique,
    },
  }
}
