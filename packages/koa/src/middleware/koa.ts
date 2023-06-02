import type { MiddlewareRequest } from "@hatchifyjs/node"
import { errorResponseHandler, getMiddlewareFunctions } from "@hatchifyjs/node"
import type Koa from "koa"
import type { Middleware as KoaMiddleware } from "koa"

import type { Hatchify } from "../koa"
import { parseHatchifyBody } from "../parse/body"

/**
 * Provides a set of exported functions, per Model, that
 * provide Koa Middleware for each operation
 */
export interface MiddlewareFunctionsKoa {
  findAll: KoaMiddleware
  findOne: KoaMiddleware
  findAndCountAll: KoaMiddleware
  create: KoaMiddleware
  update: KoaMiddleware
  destroy: KoaMiddleware
  frontend: KoaMiddleware
  schema: KoaMiddleware
  crud: KoaMiddleware

  /**
   * The `middleware.allModels.all` Middleware provides the primary hooks
   * between your Koa application and the Hatchify library
   *
   * It will use the Koa Context to determine if:
   *    1. The route resembles a Hatchify default route, by regex
   *    2. The route contains an expected Hatchify model name
   *    3. The request method is one of GET, POST, PUT, DELETE
   *
   * If these criteria pass the context will be passed to the 'everything'
   * function for the given model. Under the hood this will parse the params,
   * perform the requested model query, and serialize the result.
   *
   * If these criteria are not met the request will be ignored by
   * Hatchify and the request passed to the next available Middleware
   *
   * Valid Hatchify URLs formats
   *
   * - `[prefix]/:model`
   * - `[prefix]/:model/:id `
   *
   * @return {KoaMiddleware} Koa Middleware function that can be attached to a Koa instance (`app`) using `app.use`
   * @category General Use
   */
  all: KoaMiddleware
}

export function buildKoaMiddlewareForModel(
  hatchify: Hatchify,
  modelName: string,
): MiddlewareFunctionsKoa {
  return Object.entries(getMiddlewareFunctions(hatchify, modelName)).reduce(
    (acc, [name, genericFunction]) => ({
      ...acc,
      [name]: async (context: Koa.Context, next: Koa.Next) => {
        const request: MiddlewareRequest = {
          body: ["POST", "PATCH"].includes(context.method)
            ? await parseHatchifyBody(context)
            : undefined,
          errorCallback: context.throw,
          method: context.method,
          path: context.path,
          querystring: context.querystring,
        }

        const response = await genericFunction(request, next)

        if (response) {
          context.status = response.status || 200
          context.body = response.body
        }
      },
    }),
    {} as MiddlewareFunctionsKoa,
  )
}

export async function errorMiddleware(
  ctx: Koa.Context,
  next: Koa.Next,
): Promise<void> {
  try {
    await next()
  } catch (error) {
    const { errors, status } = errorResponseHandler(error)

    ctx.status = status
    ctx.body = errors
  }
}
