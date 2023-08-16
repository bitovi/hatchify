import type { Model, ModelAttributeColumnOptions } from "sequelize"

export type Attribute<M extends Model = Model> =
  ModelAttributeColumnOptions<M> & {
    include?: any
  }
