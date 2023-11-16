import { FinalSchema, getSchemaKey } from "@hatchifyjs/core"
import { omit, snakeCase } from "lodash"
import { DataTypes } from "sequelize"
import type {
  AbstractDataTypeConstructor,
  Dialect,
  Model,
  ModelStatic,
  Sequelize,
} from "sequelize"

import { getSequelizeSchemaName } from "./getSequelizeSchemaName"

export function toSequelize(
  schemas: { [schemaName: string]: FinalSchema },
  sequelize: Sequelize,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { [schemaName: string]: ModelStatic<any> } {
  const dialect = sequelize.getDialect() as Dialect

  return Object.entries(schemas).reduce(
    (acc, [schemaName, finalizedSchema]) => ({
      ...acc,
      [schemaName]: sequelize.define<Model<FinalSchema["attributes"]>>(
        getSchemaKey(finalizedSchema),
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
              ...omit(sequelize, ["defaultValue", "type", "typeArgs"]),
              type:
                "typeArgs" in sequelize
                  ? (DataTypes as Record<string, AbstractDataTypeConstructor>)[
                      sequelize.type
                      // @ts-expect-error
                    ](...((sequelize.typeArgs as number[] | string[]) ?? []))
                  : (DataTypes as Record<string, AbstractDataTypeConstructor>)[
                      sequelize.type
                    ],
              ...(sequelize.defaultValue === null
                ? {}
                : { defaultValue: sequelize.defaultValue }),
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
          schema: getSequelizeSchemaName(dialect, finalizedSchema.namespace),
          tableName: snakeCase(finalizedSchema.name),
        },
      ),
    }),
    {},
  )
}
