import { extendSequelize } from "@hatchifyjs/sequelize-create-with-associations"
import { Sequelize } from "sequelize"
import type { Options } from "sequelize"

import type { SequelizeWithHatchify } from "../types"

export function createSequelizeInstance(
  options: Options = {
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  },
): SequelizeWithHatchify {
  extendSequelize(Sequelize)

  return new Sequelize(options) as SequelizeWithHatchify
}
