import { integer } from "./dataTypes"
import type { PartialAttribute, PartialSchemaV2, SchemaV2 } from "./types"

interface PartialSchemas {
  [schemaName: string]: PartialSchemaV2
}

interface Schemas {
  [schemaName: string]: SchemaV2
}

export function createIfNotFound(
  attribute?: PartialAttribute<number>,
): PartialAttribute<number> {
  return attribute || integer({ primary: true, autoIncrement: true, min: 1 })
}

export function makePrimary<T>(
  attribute?: PartialAttribute<T>,
): PartialAttribute<T> {
  if (!attribute) throw new Error("attribute is missing, use createIfNotFound")
  return {
    ...attribute,
    control: { ...attribute.control, primary: true },
    orm: {
      ...attribute.orm,
      sequelize: { ...attribute.orm.sequelize, primaryKey: true },
    },
  }
}

export function makePrimaryRequired<T>(
  attribute?: PartialAttribute<T>,
): PartialAttribute<T> {
  if (!attribute) throw new Error("attribute is missing, use createIfNotFound")
  return {
    ...attribute,
    control: {
      ...attribute.control,
      allowNull: attribute.control.primary
        ? false
        : attribute.control.allowNull,
    },
    orm: {
      ...attribute.orm,
      sequelize: {
        ...attribute.orm.sequelize,
        allowNull: attribute.orm.sequelize.primaryKey
          ? false
          : attribute.orm.sequelize.allowNull,
      },
    },
  }
}

export function setDefaults<T>(
  attribute?: PartialAttribute<T>,
): PartialAttribute<T> {
  if (!attribute) throw new Error("attribute is missing, use createIfNotFound")
  return {
    ...attribute,
    control: {
      ...attribute.control,
      allowNull: attribute.control.allowNull ?? true,
      min: attribute.control.min ?? -Infinity,
      max: attribute.control.max ?? Infinity,
      primary: !!attribute.control.primary,
    },
    orm: {
      ...attribute.orm,
      sequelize: {
        ...attribute.orm.sequelize,
        allowNull: attribute.orm.sequelize.allowNull ?? true,
        autoIncrement: !!attribute.orm.sequelize.autoIncrement,
        primaryKey: !!attribute.orm.sequelize.primaryKey,
      },
    },
  }
}

export function assembler(schemas: PartialSchemas): Schemas {
  const idFunctions = [
    createIfNotFound,
    makePrimary,
    makePrimaryRequired,
    setDefaults,
  ]
  const attributeFunctions = [setDefaults]

  return Object.entries(schemas).reduce(
    (acc, [schemaName, schema]) => ({
      ...acc,
      [schemaName]: {
        ...schema,
        id: idFunctions.reduce(
          (currValue, currFunction) => currFunction(currValue),
          schema.id,
        ),
        attributes: Object.entries(schema.attributes).reduce(
          (acc, [attributeName, attribute]) => ({
            ...acc,
            [attributeName]: attributeFunctions.reduce(
              (currValue, currFunction) => currFunction(currValue),
              attribute,
            ),
          }),
          {},
        ),
      },
    }),
    {},
  )
}
