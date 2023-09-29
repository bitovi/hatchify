import type { FinalStringORM, PartialStringORM } from "./types"

export function finalizeOrm({ sequelize }: PartialStringORM): FinalStringORM {
  return {
    sequelize: {
      ...sequelize,
      typeArgs: sequelize.typeArgs.length ? sequelize.typeArgs : [255],
      allowNull: sequelize.allowNull !== false && !sequelize.primaryKey,
      primaryKey: !!sequelize.primaryKey,
      defaultValue: sequelize.defaultValue ?? null,
    },
  }
}
