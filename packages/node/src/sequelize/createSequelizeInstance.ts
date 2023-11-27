import { extendSequelize } from "@hatchifyjs/sequelize-create-with-associations"
import { Sequelize } from "sequelize"

import { CustomDecimal } from "./customTypes/CustomDecimal"
import { CustomInteger } from "./customTypes/CustomInteger"
import type { DatabaseOptions, SequelizeWithHatchify } from "../types"

export function createSequelizeInstance(
  options?: DatabaseOptions,
): SequelizeWithHatchify {
  const { uri, logging, additionalOptions } = {
    ...options,
    uri: options?.uri || "sqlite://localhost/:memory",
  }

  extendSequelize(Sequelize)

  const sequelize = new Sequelize(uri, {
    dialectOptions: additionalOptions,
    logging: logging ?? false,
    hooks: {
      afterConnect: function afterConnectWrapper() {
        // @ts-expect-error
        this.connectionManager.refreshTypeParser({
          DECIMAL: CustomDecimal,
          INTEGER: CustomInteger,
        })
      },
    },
  })

  return sequelize as SequelizeWithHatchify
}
