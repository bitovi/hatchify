import { Hatchify as HatchifyNode, buildExportWrapper } from "@hatchifyjs/node"
import type { HatchifyModel, HatchifyOptions } from "@hatchifyjs/node"

import { buildMiddlewareForModel, errorMiddleware } from "./middleware/koa"
import type { MiddlewareFunctionsKoa } from "./middleware/koa"

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
export class Hatchify extends HatchifyNode {
  constructor(models: HatchifyModel[], options: HatchifyOptions = {}) {
    super(models, options)
  }

  /**
   * The `middleware` export is one of the primary tools provided by Hatchify for working
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
}

export const errorHandlerMiddleware = errorMiddleware

export function hatchifyKoa(
  models: HatchifyModel[],
  options: HatchifyOptions = {},
): Hatchify {
  return new Hatchify(models, options)
}
