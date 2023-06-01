import type { Identifier, Sequelize } from "sequelize"
import JSONAPISerializer from "json-api-serializer"
import { match } from "path-to-regexp"
import { capitalize, singularize } from "inflection"

import type {
  HatchifyModel,
  HatchifyModelCollection,
  HatchifyOptions,
  SequelizeModelsCollection,
  FunctionsHandler,
  ModelFunctionsCollection,
  Virtuals,
} from "./types"
import {
  convertHatchifyModels,
  createSequelizeInstance,
  buildHatchifyModelObject,
} from "./sequelize"
import type {
  // buildParserForModelStandalone,
  ParseFunctions,
} from "./parse"
import { buildParserForModel } from "./parse"

import type {
  // buildSerializerForModelStandalone,
  SerializeFunctions,
} from "./serialize"
import { buildSerializerForModel } from "./serialize"
import type { EverythingFunctions } from "./everything"
import { buildEverythingForModel } from "./everything"
import { buildSchemaForModel } from "./schema"
import type { IAssociation } from "@hatchifyjs/sequelize-create-with-associations"
import type { HatchifyErrorOptions } from "./error/errors"
import { HatchifyError } from "./error/errors"

/**
 * Parse can be imported from the `@bitovi/hatchify` package
 *
 * This function provides direct access to the querystring parsing and validation of Hatchify without
 * needing to create a Hatchify instance. You can use a Hatchify Model directly along with your querystring
 * and the Parse function will return the underlying ORM query options.
 *
 * @param {HatchifyModel} model The Hatchify Model to use for validation, attributes, relationships, etc
 * @returns {ModelFunctionsCollection<ParseFunctions>}
 */
// export function Parse(model: HatchifyModel) {
//   return buildParserForModelStandalone(model);
// }

/**
 * Serialize can be imported from the `@bitovi/hatchify` package
 *
 * This function provides direct access to the result serializer Hatchify without
 * needing to create a Hatchify instance. You can use a Hatchify Model directly along with your data
 * and the Serialize function will return a valid JSON:API serialized version.
 *
 * @param {HatchifyModel} model The Hatchify Model to use for validation, attributes, relationships, etc
 * @returns {ModelFunctionsCollection<SerializeFunctions>}
 */
// export function Serialize(model: HatchifyModel) {
//   return buildSerializerForModelStandalone(model);
// }

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
  private _sequelize: Sequelize
  private _serializer: JSONAPISerializer
  private _allowedMethods: ["GET", "POST", "PATCH", "DELETE"]
  private _sequelizeModelNames: string[]
  private _prefix: string

  virtuals: Virtuals

  // this is a lookup that shows all associations for each model.
  associationsLookup: Record<string, Record<string, IAssociation> | undefined>

  /**
   * Creates a new Hatchify instance
   *
   * @param {HatchifyModel[]} models An array of Hatchify Models
   * @param {HatchifyOptions} options Configuration options for Hatchify
   *
   * @return {Hatchify}
   */
  constructor(models: HatchifyModel[], options: HatchifyOptions = {}) {
    // Prepare the ORM instance and keep references to the different Models
    this._sequelize = createSequelizeInstance(options.database)

    this._serializer = new JSONAPISerializer()

    // Fetch the hatchify models and associations look up
    const {
      associationsLookup,
      models: sequelizeModels,
      virtuals,
    } = convertHatchifyModels(this._sequelize, this._serializer, models)

    this.virtuals = virtuals
    this.associationsLookup = associationsLookup
    this._sequelizeModels = sequelizeModels

    // Types of requests that Hatchify should attempt to process
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
  get models(): HatchifyModelCollection {
    return buildHatchifyModelObject(this._sequelizeModels)
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
   * @see {@link HatchifyModel}
   *
   * @returns {ModelFunctionsCollection<HatchifyModel>}
   * @category General Use
   */
  get schema() {
    return buildExportWrapper<HatchifyModel>(this, buildSchemaForModel)
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
  isValidHatchifyRoute(method, path: string): boolean {
    if (!this._allowedMethods.includes(method)) {
      return false
    }

    const model = this.getHatchifyModelNameForRoute(path)

    if (model) {
      return true
    } else {
      return false
    }
  }

  /**
   * This function will take a URL and attempt to pull Hatchify
   * specific parameters from it. Generally these are the `model` and or `id`
   *
   * Note: While this function is exported from Hatchify it is unusual to need to it externally
   *
   * @param path Usually the incoming request URL
   * @returns { model?: string; id?: Identifier }
   * @internal
   */
  getHatchifyURLParamsForRoute(path: string): {
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
   * This function will take a URL and attempt to pull a Hatchify model name
   * parameter from it. If one is found, and valid, it will be returned.
   *
   * If there is no model, or it is not a known name, `false` will be returned
   *
   * Note: While this function is exported from Hatchify it is unusual to need to it externally
   *
   * @param {string} path Usually the incoming request URL
   * @returns {string | false} Returns a `string` with the model name, if found, otherwise `false`
   * @internal
   */
  getHatchifyModelNameForRoute(path: string): false | string {
    const result = this.getHatchifyURLParamsForRoute(path)

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

export const Error = HatchifyError

function buildExportWrapper<T>(
  hatchify: Hatchify,
  handlerFunction: FunctionsHandler<T>,
): ModelFunctionsCollection<T> {
  const wrapper: ModelFunctionsCollection<T> = {
    "*": handlerFunction(hatchify, "*"),
    allModels: handlerFunction(hatchify, "*"),
  }
  Object.keys(hatchify.models).forEach((modelName) => {
    wrapper[modelName] = handlerFunction(hatchify, modelName)
  })

  return wrapper
}
