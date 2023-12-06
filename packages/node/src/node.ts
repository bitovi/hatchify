import {
  assembler,
  getEndpoint,
  pascalCaseToKebabCase,
  pluralize,
} from "@hatchifyjs/core"
import type { FinalSchema, PartialSchema } from "@hatchifyjs/core"
import type { IAssociation } from "@hatchifyjs/sequelize-create-with-associations/dist/sequelize/types"
import JSONAPISerializer from "json-api-serializer"
import { noCase } from "no-case"
import { match } from "path-to-regexp"
import type { MatchFunction } from "path-to-regexp"
import type { Identifier, Sequelize } from "sequelize"
import type { Database } from "sqlite3"

import type { HatchifyErrorOptions } from "./error"
import { HatchifyError } from "./error"
import type { EverythingFunctions } from "./everything"
import { buildEverythingForModel } from "./everything"
import { buildParserForModel } from "./parse"
import type { ParseFunctions } from "./parse"
import { buildSchemaForModel } from "./schema"
import { convertHatchifyModels, createSequelizeInstance } from "./sequelize"
import { buildSerializerForModel } from "./serialize"
import type { SerializeFunctions } from "./serialize"
import type {
  FunctionsHandler,
  HatchifyOptions,
  ModelFunctionsCollection,
  SequelizeModelsCollection,
  SequelizeWithHatchify,
  SyncOptions,
  Virtuals,
} from "./types"

/**
 * Hatchify can be imported from the `@hatchifyjs/koa` package
 *
 * This class provides the entry point into the Hatchify library. To use Hatchify with your project
 * you will create an instance of this class passing it your Model definitions along with (optional) settings.
 *
 * @see {@link constructor}
 *
 * In order to use Hatchify with Koa or Express you should look at the Middleware exports below
 * @see {@link MiddlewareFunctionsKoa.all}
 *
 */
export class Hatchify {
  private _sequelizeModels: SequelizeModelsCollection
  private _sequelize: SequelizeWithHatchify
  private _serializer = new JSONAPISerializer()
  private _prefix?: string
  private _schemas: Record<string, FinalSchema>
  private _pathMatch?: MatchFunction<{ "0": string; id: Identifier }>

  virtuals: Virtuals = {}

  // this is a lookup that shows all associations for each model.
  associationsLookup: Record<string, Record<string, IAssociation> | undefined>

  /**
   * Creates a new Hatchify instance
   *
   * @param {Record<string, PartialSchema>} partialSchemas A record of Hatchify schemas
   * @param {HatchifyOptions} options Configuration options for Hatchify
   *
   * @return {Hatchify}
   */
  constructor(
    partialSchemas: Record<string, PartialSchema>,
    options: HatchifyOptions = {},
  ) {
    this._prefix = options.prefix

    // Prepare the ORM instance and keep references to the different Models
    this._sequelize = createSequelizeInstance(options.database)

    if (this._sequelize.getDialect() === "sqlite") {
      const gc = this._sequelize.connectionManager.getConnection
      this._sequelize.connectionManager.getConnection = async function (
        ...args: Parameters<typeof gc>
      ) {
        const db: Database = (await gc.apply(this, args)) as Database

        await new Promise((resolve) =>
          db.run("PRAGMA case_sensitive_like=ON", resolve),
        )
        return db
      }
    }
    this._serializer = new JSONAPISerializer()

    const finalSchemas = assembler(partialSchemas)

    const { associationsLookup, models } = convertHatchifyModels(
      this._sequelize,
      this._serializer,
      finalSchemas,
    )

    this.associationsLookup = associationsLookup
    this._schemas = finalSchemas
    this._sequelizeModels = models

    const endpoints = Object.values(finalSchemas).map((schema) =>
      getEndpoint(schema),
    )

    this._pathMatch = endpoints.length
      ? match(`${options.prefix ?? ""}/(${endpoints.join("|")})/:id?`, {
          decode: decodeURIComponent,
          end: false,
        })
      : undefined
  }

  printEndpoints(): void {
    const endpoints = Object.values(this._schemas).reduce((acc, schema) => {
      const endpoint = `${this._prefix}/${getEndpoint(schema)}`
      return [
        ...acc,
        `GET    ${endpoint}`,
        `POST   ${endpoint}`,
        `GET    ${endpoint}/:id`,
        `PATCH  ${endpoint}/:id`,
        `DELETE ${endpoint}/:id`,
      ]
    }, [] as string[])
    console.info("Hatchify endpoints:\r\n\r\n" + endpoints.join("\r\n"))
  }

  /**
   * Returns the raw Sequelize instance directly
   * @hidden
   */
  get orm(): Sequelize {
    return this._sequelize
  }

  /**
   * Returns the raw Serializer
   * @hidden
   */
  get serializer(): JSONAPISerializer {
    return this._serializer
  }

  /**
   * The `model` export is one of the primary tools provided by Hatchify for working
   * with your Models in custom routes.
   *
   * From the `model` export you can target one of your Models by name which will
   * give you further access to a number of named functions
   *
   *
   * @returns {SequelizeModelsCollection}
   * @category General Use
   */
  get model(): SequelizeModelsCollection {
    return this._sequelizeModels
  }

  /**
   * Returns an object mapping model names to Hatchify models
   * @hidden
   */
  get models(): SequelizeModelsCollection {
    return this._sequelizeModels
  }

  /**
   * The `parse` export is one of the primary tools provided by Hatchify for working
   * with your Models in custom routes.
   *
   * From the `parse` export you can target one of your Models by name which will
   * give you further access to a number of named functions
   *
   * For more information about the underlying per-model functions:
   * @see {@link ParseFunctions}
   *
   * @returns {ModelFunctionsCollection<ParseFunctions>}
   * @category General Use
   */
  get parse() {
    return buildExportWrapper<ParseFunctions>(this, buildParserForModel)
  }

  /**
   * The `serialize` export is one of the primary tools provided by Hatchify for working
   * with your Models in custom routes.
   *
   * From the `serialize` export you can target one of your Models by name which will
   * give you further access to a number of named functions
   *
   * For more information about the underlying per-model functions:
   * @see {@link SerializeFunctions}
   *
   * @returns {ModelFunctionsCollection<SerializeFunctions>}
   * @category General Use
   */
  get serialize() {
    return buildExportWrapper<SerializeFunctions>(this, buildSerializerForModel)
  }

  /**
   * Create a JSON:API Compliant Error Result
   *
   * @param {HatchifyError} options
   * @returns { HatchifyError}
   */
  static createError(options: HatchifyErrorOptions): HatchifyError {
    const error = new HatchifyError(options)

    return error
  }

  /**
   * The `schema` export is one of the primary tools provided by Hatchify for working
   * with your Models in custom routes.
   *
   * From the `schema` export you can target one of your Models by name which will
   * give you further access to a number of named functions
   *
   * For more information about the underlying per-model functions:
   * @see {@link FinalSchema}
   *
   * @returns {ModelFunctionsCollection<FinalSchema>}
   * @category General Use
   */
  get schema(): ModelFunctionsCollection<FinalSchema> {
    return buildExportWrapper<FinalSchema>(this, buildSchemaForModel)
  }

  /**
   * The `everything` export is one of the primary tools provided by Hatchify for working
   * with your Models in custom routes.
   *
   * The `everything` export calls the `parse`, `model`, and `serialize` under the hood
   * allowing you to do 'everything' in one function instead of calling each part individually.
   *
   * From the `everything` export you can target one of your Models by name which will
   * give you further access to a number of named functions
   *
   * For more information about the underlying per-model functions:
   * @see {@link EverythingFunctions}
   *
   * @returns {ModelFunctionsCollection<EverythingFunctions>}
   * @category General Use
   */
  get everything() {
    return buildExportWrapper<EverythingFunctions>(
      this,
      buildEverythingForModel,
    )
  }

  /**
   * This function takes the method, path, and the known list of models
   * from the Hatchify instance and determines if the current requested path
   * is one that matches a Hatchify operation.
   *
   * Note: While this function is exported from Hatchify it is unusual to need to it externally
   *
   * @param {string} method GET, PUT, POST, DELETE, PATCH
   * @param {string} path Usually the incoming request URL
   * @return {boolean}
   * @internal
   */
  isValidHatchifyRoute(method: string, path: string): boolean {
    return (
      !!["GET", "POST", "PATCH", "DELETE"].includes(method) &&
      !!this.getHatchifyURLParamsForRoute(path).modelName
    )
  }

  /**
   * This function will take a URL and attempt to pull Hatchify
   * specific parameters from it. Generally these are the `modelName` and or `id`
   *
   * Note: While this function is exported from Hatchify it is unusual to need to it externally
   *
   * @param path Usually the incoming request URL
   * @returns { modelName?: string; id?: Identifier }
   * @internal
   */
  getHatchifyURLParamsForRoute(path: string): {
    modelName?: string
    id?: Identifier
  } {
    const parsedUrl = this._pathMatch?.(path)

    if (!parsedUrl) {
      return {}
    }

    const { params } = parsedUrl
    const urlParts = params["0"].split("/")
    const [kebabNamespace, kebabSchemaName] =
      urlParts.length === 1 ? [undefined, urlParts[0]] : urlParts

    const modelName = Object.keys(this._schemas).find((schemaName) => {
      const schema = this._schemas[schemaName]
      return (
        pascalCaseToKebabCase(schema.namespace) === kebabNamespace &&
        pascalCaseToKebabCase(schema.pluralName ?? pluralize(schema.name)) ===
          kebabSchemaName
      )
    })

    return {
      modelName,
      id: params.id,
    }
  }

  /**
   * Note: This function should primarily be used for test cases.
   *
   * The `modelSync` function is a destructive operation that will
   * sync your defined models to the configured database.
   *
   * This means that your database will be dropped and its schema
   * will be overwritten with your defined models.
   *
   * @returns {Promise<Sequelize>} Sequelize Instance
   * @category Testing Use
   */
  async modelSync(options?: SyncOptions): Promise<Sequelize> {
    const force = options && "force" in options && options.force
    const alter = options && "alter" in options && options.alter

    if (this._sequelize.getDialect() === "postgres") {
      let existingPostgresSchemas: string[] = []

      if (force) {
        await this._sequelize.dropAllSchemas({})
        existingPostgresSchemas = []
      } else if (alter) {
        existingPostgresSchemas = (await this._sequelize.showAllSchemas(
          {},
        )) as unknown as string[]
      }

      const missingPostgresSchemas = Object.values(this.schema).reduce(
        (acc, model) => {
          const schemaName =
            model?.namespace && noCase(model.namespace, { delimiter: "_" })
          return schemaName &&
            !existingPostgresSchemas.includes(schemaName) &&
            (alter || force)
            ? acc.add(schemaName)
            : acc
        },
        new Set<string>(),
      )

      await Promise.all(
        [...missingPostgresSchemas].map((postgresSchema) =>
          this._sequelize.createSchema(postgresSchema, {}),
        ),
      )
    }

    try {
      return await this._sequelize.sync(options)
    } catch (ex) {
      console.error("Sync Failed:", ex)
      throw ex
    }
  }
}

export const Error = HatchifyError

export function buildExportWrapper<T>(
  hatchify: Hatchify,
  handlerFunction: FunctionsHandler<T>,
): ModelFunctionsCollection<T> {
  const wrapper: ModelFunctionsCollection<T> = {
    "*": handlerFunction(hatchify, "*"),
    allModels: handlerFunction(hatchify, "*"),
  }
  Object.keys(hatchify.models).forEach((modelName: string) => {
    wrapper[modelName] = handlerFunction(hatchify, modelName)
  })

  return wrapper
}
