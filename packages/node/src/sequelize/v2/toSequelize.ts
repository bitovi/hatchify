import type { FinalSchema } from "@hatchifyjs/hatchify-core"
import { omit, snakeCase } from "lodash"
import { DataTypes } from "sequelize"
import type { Model, ModelStatic, Sequelize } from "sequelize"

import type { HatchifyModel } from "../../types"

export function toSequelize(
  schemas: { [schemaName: string]: FinalSchema },
  sequelize: Sequelize,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { [schemaName: string]: ModelStatic<any> } {
  return Object.entries(schemas).reduce(
    (acc, [schemaName, finalizedSchema]) => ({
      ...acc,
      [schemaName]: sequelize.define<Model<HatchifyModel["attributes"]>>(
        finalizedSchema.name,
        Object.entries({
          id: finalizedSchema.id,
          ...finalizedSchema.attributes,
        }).reduce(
          (
            acc,
            [
              attributeName,
              {
                orm: { sequelize },
                setORMPropertyValue,
              },
            ],
          ) => ({
            ...acc,
            [attributeName]: {
              ...omit(sequelize, ["type", "typeArgs"]),
              type: DataTypes[sequelize.type](...(sequelize.typeArgs ?? [])),
              validate: {
                setORMPropertyValue,
              },
            },
          }),
          {},
        ),
        {
          underscored: true,
          createdAt: false,
          updatedAt: false,
          freezeTableName: true,
          schema: snakeCase(finalizedSchema.namespace) || "",
          tableName: snakeCase(finalizedSchema.name),
        },
      ),
    }),
    {},
  )
}
