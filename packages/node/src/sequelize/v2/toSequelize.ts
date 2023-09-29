import type { FinalSchema } from "@hatchifyjs/core"
import { omit, snakeCase } from "lodash"
import { DataTypes } from "sequelize"
import type { Model, ModelStatic, Sequelize } from "sequelize"

import type { HatchifyModel } from "../../types"
import { getFullModelName } from "../../utils/getFullModelName"

export function toSequelize(
  schemas: { [schemaName: string]: FinalSchema },
  sequelize: Sequelize,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { [schemaName: string]: ModelStatic<any> } {
  return Object.entries(schemas).reduce(
    (acc, [schemaName, finalizedSchema]) => ({
      ...acc,
      [schemaName]: sequelize.define<Model<HatchifyModel["attributes"]>>(
        getFullModelName(finalizedSchema),
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
                  ? DataTypes[sequelize.type](
                      ...((sequelize.typeArgs as number[] | string[]) ?? []),
                    )
                  : DataTypes[sequelize.type],
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
          schema: snakeCase(finalizedSchema.namespace) || "",
          tableName: snakeCase(finalizedSchema.name),
        },
      ),
    }),
    {},
  )
}
