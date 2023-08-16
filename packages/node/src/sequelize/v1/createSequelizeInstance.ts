import { extendSequelize } from "@hatchifyjs/sequelize-create-with-associations"
import { Sequelize } from "sequelize"
import type { Options } from "sequelize"

export function createSequelizeInstance(
  options: Options = {
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  },
): Sequelize {
  extendSequelize(Sequelize)

  return new Sequelize(options)
}
