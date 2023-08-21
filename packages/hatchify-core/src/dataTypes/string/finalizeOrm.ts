import type { FinalStringORM, PartialStringORM } from "./types"

export function finalizeOrm({ sequelize }: PartialStringORM): FinalStringORM {
  return {
    sequelize: {
      ...sequelize,
      typeArgs: [],
      allowNull: sequelize.allowNull !== false && !sequelize.primaryKey,
      autoIncrement: !!sequelize.autoIncrement,
      primaryKey: !!sequelize.primaryKey,
    },
  }
}
