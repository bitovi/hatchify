import { Identifier, Sequelize } from "sequelize"
import JSONAPISerializer from "json-api-serializer"
import { match } from "path-to-regexp"
import { capitalize, singularize } from "inflection"

import {
  ScaffoldModel,
  ScaffoldModelCollection,
  ScaffoldOptions,
  SequelizeModelsCollection,
  FunctionsHandler,
  ModelFunctionsCollection,
  Virtuals,
} from "./types"
import {
  convertScaffoldModels,
  createSequelizeInstance,
  buildScaffoldModelObject,
} from "./sequelize"
import {
  buildParserForModel,
  // buildParserForModelStandalone,
  ParseFunctions,
} from "./parse"

import {
  buildSerializerForModel,
  // buildSerializerForModelStandalone,
  SerializeFunctions,
} from "./serialize"
import {
  buildMiddlewareForModel,
  errorMiddleware,
  MiddlewareFunctionsKoa,
} from "./middleware"
import { buildEverythingForModel, EverythingFunctions } from "./everything"
import { buildSchemaForModel } from "./schema"
import { IAssociation } from "./sequelize/types"
import { ScaffoldError, ScaffoldErrorOptions } from "./error/errors"

/**
 * Parse can be imported from the `@bitovi/scaffold` package
 *
 * This function provides direct access to the querystring parsing and validation of Scaffold without
 * needing to create a Scaffold instance. You can use a Scaffold Model directly along with your querystring
 * and the Parse function will return the underlying ORM query options.
 *
 * @param {ScaffoldModel} model The Scaffold Model to use for validation, attributes, relationships, etc
 * @returns {ModelFunctionsCollection<ParseFunctions>}
 */
// export function Parse(model: ScaffoldModel) {
//   return buildParserForModelStandalone(model);
// }

/**
 * Serialize can be imported from the `@bitovi/scaffold` package
 *
 * This function provides direct access to the result serializer Scaffold without
 * needing to create a Scaffold instance. You can use a Scaffold Model directly along with your data
 * and the Serialize function will return a valid JSON:API serialized version.
 *
 * @param {ScaffoldModel} model The Scaffold Model to use for validation, attributes, relationships, etc
 * @returns {ModelFunctionsCollection<SerializeFunctions>}
 */
// export function Serialize(model: ScaffoldModel) {
//   return buildSerializerForModelStandalone(model);
// }

/**
 * Scaffold can be imported from the `@bitovi/scaffold` package
 *
 * This class provides the entry point into the Scaffold library. To use Scaffold with your project
 * you will create an instance of this class passing it your Model definitions along with (optional) settings.
 *
 * @see {@link constructor}
 *
 * In order to use Scaffold with Koa or Express you should look at the Middleware exports below
 * @see {@link MiddlewareFunctionsKoa.all}
 *
 */
export class Scaffold {
  private _sequelizeModels: SequelizeModelsCollection
  private _sequelize: Sequelize
  private _serializer: JSONAPISerializer
  private _allowedMethods: ["GET", "POST", "PATCH", "DELETE"]
  private _sequelizeModelNames: string[]
  private _prefix: string

  virtuals: Virtuals

  // this is a lookup that shows all associations for each model.
  associationsLookup: Record<string, Record<string, IAssociation> | undefined>

  /**
   * Creates a new Scaffold instance
   *
   * @param {ScaffoldModel[]} models An array of Scaffold Models
   * @param {ScaffoldOptions} options Configuration options for Scaffold
   *
   * @return {Scaffold}
   */
  constructor(models: ScaffoldModel[], options: ScaffoldOptions = {}) {
    // Prepare the ORM instance and keep references to the different Models
    this._sequelize = createSequelizeInstance(this, options.database)

    this._serializer = new JSONAPISerializer()

    // Fetch the scaffold models and associations look up
    const {
      associationsLookup,
      models: sequelizeModels,
      virtuals,
    } = convertScaffoldModels(this._sequelize, this._serializer, models)

    this.virtuals = virtuals
    this.associationsLookup = associationsLookup
    this._sequelizeModels = sequelizeModels

    // Types of requests that Scaffold should attempt to process
    this._allowedMethods = ["GET", "POST", "PATCH", "DELETE"]

    // Do some quick work up front to get the list of model names
    this._sequelizeModelNames = Object.keys(this._sequelizeModels)

    // Store the route prefix if the user set one
    this._prefix = options.prefix || ""

    if (options.sync) {
      this.createDatabase()
    }
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
   * The `model` export is one of the primary tools provided by Scaffold for working
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
   * Returns an object mapping model names to Scaffold models
   * @hidden
   */
  get models(): ScaffoldModelCollection {
    return buildScaffoldModelObject(this._sequelizeModels)
  }

  /**
   * The `parse` export is one of the primary tools provided by Scaffold for working
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
   * The `serialize` export is one of the primary tools provided by Scaffold for working
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
   * @param {ScaffoldError} options
   * @returns { ScaffoldError}
   */
  static createError(options: ScaffoldErrorOptions): ScaffoldError {
    const error = new ScaffoldError(options)

    return error
  }

  /**
   * The `middleware` export is one of the primary tools provided by Scaffold for working
   * with your Models in custom routes.
   *
   * From the `middleware` export you can target one of your Models by name which will
   * give you further access to a number of named functions
   *
   * For more information about the underlying per-model functions:
   * @see {@link MiddlewareFunctionsKoa}
   *
   * @returns {ModelFunctionsCollection<MiddlewareFunctionsKoa>}
   * @category General Use
   */
  get middleware() {
    return buildExportWrapper<MiddlewareFunctionsKoa>(
      this,
      buildMiddlewareForModel,
    )
  }

  /**
   * The `schema` export is one of the primary tools provided by Scaffold for working
   * with your Models in custom routes.
   *
   * From the `schema` export you can target one of your Models by name which will
   * give you further access to a number of named functions
   *
   * For more information about the underlying per-model functions:
   * @see {@link ScaffoldModel}
   *
   * @returns {ModelFunctionsCollection<ScaffoldModel>}
   * @category General Use
   */
  get schema() {
    return buildExportWrapper<ScaffoldModel>(this, buildSchemaForModel)
  }

  /**
   * The `everything` export is one of the primary tools provided by Scaffold for working
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
   * from the Scaffold instance and determines if the current requested path
   * is one that matches a Scaffold operation.
   *
   * Note: While this function is exported from Scaffold it is unusual to need to it externally
   *
   * @param {string} method GET, PUT, POST, DELETE, PATCH
   * @param {string} path Usually the incoming request URL
   * @return {boolean}
   * @internal
   */
  isValidScaffoldRoute(method, path: string): boolean {
    if (!this._allowedMethods.includes(method)) {
      return false
    }

    const model = this.getScaffoldModelNameForRoute(path)

    if (model) {
      return true
    } else {
      return false
    }
  }

  /**
   * This function will take a URL and attempt to pull Scaffold
   * specific parameters from it. Generally these are the `model` and or `id`
   *
   * Note: While this function is exported from Scaffold it is unusual to need to it externally
   *
   * @param path Usually the incoming request URL
   * @returns { model?: string; id?: Identifier }
   * @internal
   */
  getScaffoldURLParamsForRoute(path: string): {
    model?: string
    id?: Identifier
  } {
    const isPathWithModelId = match<{ model: string; id: Identifier }>(
      this._prefix + "/:model/:id",
      {
        decode: decodeURIComponent,
        strict: false,
        sensitive: false,
        end: false,
      },
    )

    const isPathWithModelIdResult = isPathWithModelId(path)
    if (isPathWithModelIdResult) {
      const endpointName = isPathWithModelIdResult.params.model

      // Validate if endpoint name is lowercase
      if (endpointName === endpointName.toLowerCase()) {
        const singular = singularize(endpointName)

        // Validate if endpoint name is plural
        if (endpointName !== singular) {
          isPathWithModelIdResult.params.model = capitalize(singular)

          return isPathWithModelIdResult.params
        }
      }
    }

    const isPathWithModel = match<{ model: string }>(this._prefix + "/:model", {
      decode: decodeURIComponent,
      strict: false,
      sensitive: false,
      end: false,
    })

    const isPathWithModelResult = isPathWithModel(path)
    if (isPathWithModelResult) {
      const endpointName = isPathWithModelResult.params.model

      // Validate if endpoint is lowercase
      if (endpointName === endpointName.toLowerCase()) {
        const singular = singularize(endpointName)

        // Validate if endpoint name is plural
        if (endpointName !== singular) {
          isPathWithModelResult.params.model = capitalize(singular)

          return isPathWithModelResult.params
        }
      }
    }

    return {}
  }

  /**
   * This function will take a URL and attempt to pull a Scaffold model name
   * parameter from it. If one is found, and valid, it will be returned.
   *
   * If there is no model, or it is not a known name, `false` will be returned
   *
   * Note: While this function is exported from Scaffold it is unusual to need to it externally
   *
   * @param {string} path Usually the incoming request URL
   * @returns {string | false} Returns a `string` with the model name, if found, otherwise `false`
   * @internal
   */
  getScaffoldModelNameForRoute(path: string): false | string {
    const result = this.getScaffoldURLParamsForRoute(path)

    if (result.model) {
      const pathModelName = result.model
      const matchedModelName = this._sequelizeModelNames.find(
        (name) => name.toLowerCase() === pathModelName.toLowerCase(),
      )
      if (matchedModelName) {
        return matchedModelName
      }
    }
    return false
  }

  /**
   * Note: This function should primarily be used for test cases.
   *
   * The `createDatabase` function is a destructive operation that will
   * sync your defined models to the configured database.
   *
   * This means that your database will be dropped and its schema
   * will be overwritten with your defined models.
   *
   * @returns {Promise<Sequelize>} Sequelize Instance
   * @category Testing Use
   */
  async createDatabase(): Promise<Sequelize> {
    return this._sequelize.sync({})
  }
}

export const Error = ScaffoldError

export const errorHandlerMiddleware = errorMiddleware

function buildExportWrapper<T>(
  scaffold: Scaffold,
  handlerFunction: FunctionsHandler<T>,
): ModelFunctionsCollection<T> {
  const wrapper: ModelFunctionsCollection<T> = {
    "*": handlerFunction(scaffold, "*"),
    allModels: handlerFunction(scaffold, "*"),
  }
  Object.keys(scaffold.models).forEach((modelName) => {
    wrapper[modelName] = handlerFunction(scaffold, modelName)
  })

  return wrapper
}
