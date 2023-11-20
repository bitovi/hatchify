import { extendSequelize } from "@hatchifyjs/sequelize-create-with-associations"
import { Sequelize } from "sequelize"
import type { Options } from "sequelize"

import { CustomDecimal } from "./customTypes/CustomDecimal"
import { CustomInteger } from "./customTypes/CustomInteger"
import type { SequelizeWithHatchify } from "../types"

export function createSequelizeInstance(
  options: Options = {
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  },
): SequelizeWithHatchify {
  extendSequelize(Sequelize)

  const sequelize = new Sequelize({
    ...options,
    hooks: {
      ...options.hooks,
      afterConnect: async function afterConnectWrapper(connection, config) {
        // @ts-expect-error
        this.connectionManager.refreshTypeParser({
          DECIMAL: CustomDecimal,
          INTEGER: CustomInteger,
        })

        if (options.hooks?.afterConnect) {
          await options.hooks.afterConnect(connection, config)
        }
      },
    },
  })

  return sequelize as SequelizeWithHatchify
}
