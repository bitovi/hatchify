import { getDefaultPrimaryAttribute } from "./getDefaultPrimaryAttribute.js"
import type { PartialSchema, PartialSchemaWithPrimaryAttribute } from "./types.js"

export function ensureDefaultPrimaryAttribute(
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
            hidden: null,
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
