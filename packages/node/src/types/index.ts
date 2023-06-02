import type { JSONAPIDocument } from "json-api-serializer"
import type {
  BelongsToManyOptions,
  BelongsToOptions,
  DataType,
  HasManyOptions,
  HasOneOptions,
  Model,
  ModelAttributeColumnOptions,
  ModelCtor,
  ModelValidateOptions,
  Options,
} from "sequelize"
import type { ModelHooks } from "sequelize/types/hooks"

import type { GeneralError } from "../error"
import type { Hatchify } from "../node"

export { DataTypes } from "sequelize"
export type { ModelValidateOptions, ModelAttributes } from "sequelize"

/**
 * Hatchify Configuration
 */
export interface HatchifyOptions {
  /**
   * Setting this prefix will signal to Hatchify that it should
   * expect this path at the beginning of any incoming requests.
   *
   * This is used internally for regex path matching
   */
  prefix?: string

  /**
   * This flag will configure error behavior. If true error details
   * will be exposed to the client. If false only the error code and
   * high level message will be exposed.
   */
  expose?: boolean

  /**
   * This flag should mostly be used for development and will
   * force your Models onto the database schema at startup.
   */
  sync?: boolean

  /**
   * Notes about Sequelize connections
   */
  database?: Options
}

export const HatchifySymbolModel = Symbol("hatchify")

/**
 * Sequelize Models used internally within Hatchify contain an
 * additional Symbol property that provides access back to the
 * original Hatchify Model that was used to generate it.
 *
 * This can be helpful if there are additional properties or fields
 * provided on the original class that do not exist on the
 * Sequelize model itself.
 */
export type SequelizeModelInstance = ModelCtor<Model<any, any>> & {
  [HatchifySymbolModel]: HatchifyModel
}

export type SequelizeModelsCollection = {
  [key: string]: SequelizeModelInstance
}

export type HatchifyModelCollection = {
  [key: string]: HatchifyModel
}

export type JSONObject = Record<string, unknown>

export type JSONAnyObject = Record<string, any>

export interface ModelFunctionsCollection<T> {
  [modelName: string]: T
  "*": T
  allModels: T
}

export type FunctionsHandler<T> = (
  hatchify: Hatchify,
  name: string | symbol,
) => T

export type HatchifyAttributes = ModelAttributes<Model>

/**
 * Used when defining a Hatchify Model relationship
 * to bridge Hatchify Models and Sequelize Model options
 */
export interface BelongsToManyResult {
  target: string
  options: BelongsToManyOptions
}

/**
 * Used when defining a Hatchify Model relationship
 * to bridge Hatchify Models and Sequelize Model options
 */
export interface BelongsToResult {
  target: string
  options?: BelongsToOptions
}

/**
 * Used when defining a Hatchify Model relationship
 * to bridge Hatchify Models and Sequelize Model options
 */
export interface HasOneResult {
  target: string
  options?: HasOneOptions
}

/**
 * Used when defining a Hatchify Model relationship
 * to bridge Hatchify Models and Sequelize Model options
 */
export interface HasManyResult {
  target: string
  options?: HasManyOptions
}

/**
 * Extend sequelize ModelAttributeColumnOptions to include 'include'
 * in the model attribute column options.
 */
interface ModelAttributeColumnOptionsWithInclude<M extends Model = Model>
  extends ModelAttributeColumnOptions<M> {
  include?: string
}

/**
 * Redefine sequelize ModelAttributes
 */
type ModelAttributes<M extends Model = Model, TAttributes = unknown> = {
  /**
   * The description of a database column
   */
  [name in keyof TAttributes]:
    | DataType
    | ModelAttributeColumnOptionsWithInclude<M>
}

/**
 * Models can be defined in Hatchify by creating a `[name].ts` file containing
 * the following required (and optional) fields shown here.
 *
 * After a model is defined and passed to a Hatchify instance it will be
 * available within hatchify.orm.* by its model name
 *
 * The model name field will also dictate the usage for the dynamicly exported
 * functions provided by your Hatchify instance
 *
 */
export interface HatchifyModel {
  /**
   * Model Attributes define the fields that are associated with this model and
   * also reflect, generally, on the associated columns in your underlying database
   *
   * As an example, if you were creating a `User` model you might want to represent
   * a `firstName` and `lastName` field.
   *
   * ```ts
   * attributes: {
   *  firstName: DataTypes.STRING,
   *  lastName: DataTypes.STRING,
   * }
   * ```
   */
  attributes: ModelAttributes

  /**
   * The Model `name` dictates the underlying database table name as well
   * as how your model can be accessed later through your Hatchify instance
   */
  name: string

  /**
   * Validation in Hatchify is directly tied to features within the Sequelize ORM
   * See the Sequelize [documentation for more information](https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/#model-wide-validations)
   */
  validation?: ModelValidateOptions

  /**
   * Relationship Documentation belongsTo
   */
  belongsTo?: BelongsToResult[]
  /**
   * Relationship Documentation belongsToMany
   */
  belongsToMany?: BelongsToManyResult[]
  /**
   * Relationship Documentation hasOne
   */
  hasOne?: HasOneResult[]
  /**
   * Relationship Documentation hasMany
   */
  hasMany?: HasManyResult[]

  hooks?: Partial<ModelHooks>
}

export interface Virtuals {
  [model: string]: {
    [attribute: string]: string
  }
}

export interface MiddlewareRequest {
  body: unknown
  method: string
  path: string
  querystring: string
  errorCallback: (statusCode: number, errorCode: string) => void
}

export interface MiddlewareResponse {
  body: JSONAPIDocument | GeneralError[]
  status?: number
}

export type NextFunction = () => Promise<void>
