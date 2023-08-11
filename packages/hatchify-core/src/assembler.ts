import { integer } from "./dataTypes"
import type {
  FinalAttribute,
  FinalNumberORM,
  PartialAttribute,
  PartialNumberControlType,
  PartialNumberORM,
} from "./types"

export interface PartialSchema {
  name: string
  id?: PartialAttribute<
    PartialNumberORM,
    PartialNumberControlType,
    number,
    FinalNumberORM
  >
  attributes: {
    [attributeName: string]: PartialAttribute<
      PartialNumberORM,
      PartialNumberControlType,
      number,
      FinalNumberORM
    >
  }
}
export interface FinalSchema {
  name: string
  id: FinalAttribute<
    PartialNumberORM,
    PartialNumberControlType,
    number,
    FinalNumberORM
  >
  attributes: {
    [attributeName: string]: FinalAttribute<
      PartialNumberORM,
      PartialNumberControlType,
      number,
      FinalNumberORM
    >
  }
}

type PartialSchemaWithPrimaryAttribute = Omit<PartialSchema, "id"> & {
  id: PartialAttribute<
    PartialNumberORM,
    PartialNumberControlType,
    number,
    FinalNumberORM
  >
}

export function assembler(schemas: { [schemaName: string]: PartialSchema }): {
  [schemaName: string]: FinalSchema
} {
  return Object.entries(schemas).reduce(
    (acc, [schemaName, schema]) => ({
      ...acc,
      [schemaName]: finalize(setDefaultPrimaryAttribute(schema)),
    }),
    {},
  )
}

function finalize(schema: PartialSchemaWithPrimaryAttribute): FinalSchema {
  return {
    ...schema,
    id: schema.id.finalize(),
    attributes: Object.entries(schema.attributes).reduce(
      (acc, [attributeName, attribute]) => ({
        ...acc,
        [attributeName]: attribute.finalize(),
      }),
      {},
    ),
  }
}

function setDefaultPrimaryAttribute(
  schema: PartialSchema,
): PartialSchemaWithPrimaryAttribute {
  return {
    ...schema,
    id: schema.id
      ? {
          ...schema.id,
          control: {
            ...schema.id.control,
            primary: true,
            allowNull: false,
          },
          orm: {
            ...schema.id.orm,
            sequelize: {
              ...schema.id.orm.sequelize,
              primaryKey: true,
              allowNull: false,
            },
          },
        }
      : getDefaultPrimaryAttribute(),
  }
}

function getDefaultPrimaryAttribute() {
  return integer({
    primary: true,
    autoIncrement: true,
    required: true,
    min: 1,
  })
}
