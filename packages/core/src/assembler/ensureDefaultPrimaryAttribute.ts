import { getDefaultPrimaryAttribute } from "./getDefaultPrimaryAttribute"
import type { PartialSchema, PartialSchemaWithPrimaryAttribute } from "./types"

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
            references: null,
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
