import type { FinalSchema } from "@hatchifyjs/core"
import type { IAssociation } from "@hatchifyjs/sequelize-create-with-associations/dist/sequelize/types"
import type { JSONAPIDocument } from "json-api-serializer"
import type {
  DataType,
  Model,
  ModelAttributeColumnOptions,
  ModelStatic,
  Sequelize,
} from "sequelize"

import type { Hatchify } from "./node"

export { DataTypes } from "sequelize"
export type { ModelValidateOptions, ModelAttributes } from "sequelize"

export interface DatabaseOptions {
  /**
   * A full database URI. Defaults to in-memory SQLite.
   */
  uri?: string

  /**
   * A function that gets executed while running the query to log the sql.
   */
  logging?: (sql: string, timing?: number) => void

  /**
   * An object of additional options, which are passed directly to the connection library
   */
  additionalOptions?: object
}

/**
 * Hatchify Configuration
 */
export interface HatchifyOptions {
  /**
   * Setting this prefix will signal to Hatchify that it should
   * expect this path at the beginning of any incoming backend requests. For ex: `/api`
   *
   * This is used internally for regex path matching
   */
  prefix?: string
  /**
   * Various options for connecting to a database
   */
  database?: DatabaseOptions
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SequelizeModelInstance = ModelStatic<any> & {
  [HatchifySymbolModel]: FinalSchema
}

export type SequelizeModelsCollection = Record<string, SequelizeModelInstance>

export type SyncOptions =
  | {
      /**
       * - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
       * - Postgres: Namespaces (Postgres Schemas) are created
       */
      alter: true
    }
  | {
      /**
       * - This creates the table, dropping it first if it already existed
       * - Postgres: Namespaces (Postgres Schemas) and their tables are dropped and recreated
       */
      force: true
    }

export interface ICreateHatchifyModel {
  associationsLookup: Record<string, Record<string, IAssociation> | undefined>
  models: SequelizeModelsCollection
}

/**
 * specialized type for creating hatchify models and attaching them to
 * Sequelize models. In most cases you will want to use
 * SequelizeModelsCollection for Sequelize models.
 */
export interface SequelizeWithHatchify extends Sequelize {
  readonly models: {
    [key: string]: ModelStatic<Model> & {
      [HatchifySymbolModel]: FinalSchema
    }
  }
}

export type JSONObject = Record<string, unknown>

export type JSONAnyObject = Record<string, any>

export interface ModelFunctionsCollection<T> {
  [modelName: string]: T
  "*": T
  allModels: T
}

export type FunctionsHandler<T> = (hatchify: Hatchify, name: string) => T

export type HatchifyAttributes = ModelAttributes<Model>

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

export interface MiddlewareRequest {
  body: unknown
  method: string
  path: string
  querystring: string
  errorCallback: (statusCode: number, errorCode: string) => void
}

export interface MiddlewareResponse {
  body: JSONAPIDocument
  status?: number
}

export type NextFunction = () => Promise<void>
