import type Koa from "koa"
import type { Middleware as KoaMiddleware } from "koa"
import type { Hatchify } from "../koa"
import type {
  MiddlewareRequest,
  MiddlewareResponse,
  NextFunction,
} from "../types"
import { parseHatchifyBody } from "../parse/body"

import { errorResponseHandler } from "../error"
import { ValidationError } from "../error/errors"
import { codes, statusCodes } from "../error/constants"

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

export function getMiddlewareFunctions(
  hatchify: Hatchify,
  modelName: string,
): {
  [key: string]: (
    request: MiddlewareRequest,
    next: NextFunction,
  ) => Promise<MiddlewareResponse | void | Promise<void>>
} {
  return {
    findAll: findAllMiddleware(hatchify, modelName),
    findOne: findOneMiddleware(hatchify, modelName),
    findAndCountAll: findAndCountAllMiddleware(hatchify, modelName),
    create: createMiddleware(hatchify, modelName),
    destroy: destroyMiddleware(hatchify, modelName),
    update: updateMiddleware(hatchify, modelName),
    frontend: async ({ errorCallback }) => {
      errorCallback(500, "Not Implemented")
    },
    schema: async ({ errorCallback }) => {
      errorCallback(500, "Not Implemented")
    },
    crud: async ({ errorCallback }) => {
      errorCallback(500, "Not Implemented")
    },
    all: handleAllMiddleware(hatchify),
  }
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

export function findAllMiddleware(hatchify: Hatchify, modelName: string) {
  return async function findAllImpl({
    path,
    querystring,
  }: MiddlewareRequest): Promise<MiddlewareResponse> {
    // If this is a wildcard or allModel situation, figure out the model from the route
    if (modelName === "*") {
      modelName = resolveWildcard(hatchify, path)
    }

    return {
      body: await hatchify.everything[modelName].findAll(querystring),
    }
  }
}

export function findOneMiddleware(hatchify: Hatchify, modelName: string) {
  return async function findOneImpl({
    errorCallback,
    path,
    querystring,
  }: MiddlewareRequest): Promise<MiddlewareResponse> {
    const params = hatchify.getHatchifyURLParamsForRoute(path)
    if (!params.id) {
      throw errorCallback(400, "BAD_REQUEST")
    }

    // If this is a wildcard or allModel situation, figure out the model from the route
    if (modelName === "*") {
      if (!params.model) {
        throw errorCallback(400, "BAD_REQUEST")
      }

      modelName = params.model
    }

    return {
      body: await hatchify.everything[modelName].findOne(
        querystring,
        params.id,
      ),
    }
  }
}

export function findAndCountAllMiddleware(
  hatchify: Hatchify,
  modelName: string,
) {
  return async function findAndCountAllImpl({
    path,
    querystring,
  }: MiddlewareRequest): Promise<MiddlewareResponse> {
    // If this is a wildcard or allModel situation, figure out the model from the route
    if (modelName === "*") {
      modelName = resolveWildcard(hatchify, path)
    }

    return {
      body: await hatchify.everything[modelName].findAndCountAll(querystring),
    }
  }
}

export function createMiddleware(hatchify: Hatchify, modelName: string) {
  return async function createImpl(
    request: MiddlewareRequest,
  ): Promise<MiddlewareResponse> {
    try {
      const { body, path, querystring } = request

      // If this is a wildcard or allModel situation, figure out the model from the route
      if (modelName === "*") {
        modelName = resolveWildcard(hatchify, path)
      }

      return {
        body: await hatchify.everything[modelName].create(body, querystring),
      }
    } catch (ex) {
      console.log("error", ex)
      return { body: {} }
    }
  }
}

export function updateMiddleware(hatchify: Hatchify, modelName: string) {
  return async function updateImpl(
    request: MiddlewareRequest,
  ): Promise<MiddlewareResponse> {
    const { body, path, querystring } = request

    // If this is a wildcard or allModel situation, figure out the model from the route
    if (modelName === "*") {
      modelName = resolveWildcard(hatchify, path)
    }

    const params = hatchify.getHatchifyURLParamsForRoute(path)

    return {
      body: await hatchify.everything[modelName].update(
        body,
        querystring,
        params.id,
      ),
    }
  }
}

export function destroyMiddleware(hatchify: Hatchify, modelName: string) {
  return async function destroyImpl({
    path,
    querystring,
  }: MiddlewareRequest): Promise<MiddlewareResponse> {
    // If this is a wildcard or allModel situation, figure out the model from the route
    if (modelName === "*") {
      modelName = resolveWildcard(hatchify, path)
    }

    const params = hatchify.getHatchifyURLParamsForRoute(path)

    return {
      body: await hatchify.everything[modelName].destroy(
        querystring,
        params.id,
      ),
    }
  }
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

export function handleAllMiddleware(hatchify: Hatchify) {
  return async function handleAllImpl(
    request: MiddlewareRequest,
    next: NextFunction,
  ): Promise<MiddlewareResponse | ReturnType<Awaited<NextFunction>>> {
    const { body, method, path, querystring } = request

    try {
      // Check if this request URL takes the format of one that we expect
      if (!hatchify.isValidHatchifyRoute(method, path)) {
        return await next()
      }

      const params = hatchify.getHatchifyURLParamsForRoute(path)
      if (!params.model) {
        return await next()
      }

      switch (method) {
        case "GET": {
          if (params.id) {
            return {
              body: await hatchify.everything[params.model].findOne(
                querystring,
                params.id,
              ),
            }
          }

          return {
            body: await hatchify.everything[params.model].findAll(querystring),
          }
        }

        case "POST": {
          return {
            body: await hatchify.everything[params.model].create(
              body,
              querystring,
            ),
          }
        }

        case "PATCH": {
          if (!params.id) {
            throw new ValidationError({
              status: statusCodes.UNPROCESSABLE_ENTITY,
              code: codes.ERR_INVALID_PARAMETER,
              title: "Invalid ID Provided",
            })
          }

          return {
            body: await hatchify.everything[params.model].update(
              body,
              querystring,
              params.id,
            ),
          }
        }

        case "DELETE": {
          if (!params.id) {
            throw new ValidationError({
              status: statusCodes.UNPROCESSABLE_ENTITY,
              code: codes.ERR_INVALID_PARAMETER,
              title: "Invalid ID Provided",
            })
          }

          return {
            body: await hatchify.everything[params.model].destroy(
              querystring,
              params.id,
            ),
          }
        }

        default: {
          return await next()
        }
      }
    } catch (error) {
      const { errors, status } = errorResponseHandler(error)

      return { status, body: errors }
    }
  }
}

function resolveWildcard(hatchify: Hatchify, path): string {
  const params = hatchify.getHatchifyURLParamsForRoute(path)
  if (!params.model) {
    throw new ValidationError({
      status: statusCodes.UNPROCESSABLE_ENTITY,
      code: codes.ERR_INVALID_PARAMETER,
      title: "Invalid URL Format",
    })
  }

  if (!hatchify.model[params.model]) {
    throw new ValidationError({
      status: statusCodes.UNPROCESSABLE_ENTITY,
      code: codes.ERR_INVALID_PARAMETER,
      title: "Bad Model Name: ",
    })
  }

  return params.model
}
