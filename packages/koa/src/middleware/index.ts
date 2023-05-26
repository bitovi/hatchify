import type Koa from "koa"
import type { Hatchify } from ".."
import type { KoaMiddleware } from "../types"
import { parseHatchifyBody } from "../parse/body"
import errorResponseHandler from "../error"
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

export function buildMiddlewareForModel(
  hatchify: Hatchify,
  modelName: string,
): MiddlewareFunctionsKoa {
  return {
    findAll: findAllMiddleware(hatchify, modelName),
    findOne: findOneMiddleware(hatchify, modelName),
    findAndCountAll: findAndCountAllMiddleware(hatchify, modelName),
    create: createMiddleware(hatchify, modelName),
    destroy: destroyMiddleware(hatchify, modelName),
    update: updateMiddleware(hatchify, modelName),
    frontend: async (ctx) => {
      ctx.throw(500, "Not Implemented")
    },
    schema: async (ctx) => {
      ctx.throw(500, "Not Implemented")
    },
    crud: async (ctx) => {
      ctx.throw(500, "Not Implemented")
    },
    all: handleAllMiddleware(hatchify),
  }
}

export function findAllMiddleware(hatchify: Hatchify, modelName: string) {
  return async function findAllImpl(ctx: Koa.Context) {
    // If this is a wildcard or allModel situation, figure out the model from the route
    if (modelName === "*") {
      modelName = resolveWildcard(hatchify, ctx.path)
    }

    ctx.body = await hatchify.everything[modelName].findAll(ctx.querystring)
  }
}

export function findOneMiddleware(hatchify: Hatchify, modelName: string) {
  return async function findOneImpl(ctx: Koa.Context) {
    const params = hatchify.getHatchifyURLParamsForRoute(ctx.path)
    if (!params.id) {
      ctx.throw(400, "BAD_REQUEST")
    }

    // If this is a wildcard or allModel situation, figure out the model from the route
    if (modelName === "*") {
      if (!params.model) {
        ctx.throw(400, "BAD_REQUEST")
      }

      modelName = params.model
    }

    ctx.body = await hatchify.everything[modelName].findOne(
      ctx.querystring,
      params.id,
    )
  }
}

export function findAndCountAllMiddleware(
  hatchify: Hatchify,
  modelName: string,
) {
  return async function findAndCountAllImpl(ctx: Koa.Context) {
    // If this is a wildcard or allModel situation, figure out the model from the route
    if (modelName === "*") {
      modelName = resolveWildcard(hatchify, ctx.path)
    }

    ctx.body = await hatchify.everything[modelName].findAndCountAll(
      ctx.querystring,
    )
  }
}

export function createMiddleware(hatchify: Hatchify, modelName: string) {
  return async function createImpl(ctx: Koa.Context) {
    // If this is a wildcard or allModel situation, figure out the model from the route
    if (modelName === "*") {
      modelName = resolveWildcard(hatchify, ctx.path)
    }

    const body = await parseHatchifyBody(ctx)
    ctx.body = await hatchify.everything[modelName].create(
      body,
      ctx.querystring,
    )
  }
}

export function updateMiddleware(hatchify: Hatchify, modelName: string) {
  return async function updateImpl(ctx: Koa.Context) {
    // If this is a wildcard or allModel situation, figure out the model from the route
    if (modelName === "*") {
      modelName = resolveWildcard(hatchify, ctx.path)
    }

    const body = await parseHatchifyBody(ctx)
    const params = hatchify.getHatchifyURLParamsForRoute(ctx.path)
    ctx.body = await hatchify.everything[modelName].update(
      body,
      ctx.querystring,
      params.id,
    )
  }
}

export function destroyMiddleware(hatchify: Hatchify, modelName: string) {
  return async function destroyImpl(ctx: Koa.Context) {
    // If this is a wildcard or allModel situation, figure out the model from the route
    if (modelName === "*") {
      modelName = resolveWildcard(hatchify, ctx.path)
    }

    const params = hatchify.getHatchifyURLParamsForRoute(ctx.path)
    ctx.body = await hatchify.everything[modelName].destroy(
      ctx.querystring,
      params.id,
    )
  }
}

export async function errorMiddleware(ctx: Koa.Context, next: Koa.Next) {
  try {
    await next()
  } catch (error) {
    const { errors, status } = errorResponseHandler(error)

    ctx.status = status
    ctx.body = errors
  }
}

export function handleAllMiddleware(hatchify: Hatchify) {
  return async function handleAllImpl(ctx: Koa.Context, next: Koa.Next) {
    try {
      // Check if this request URL takes the format of one that we expect
      if (!hatchify.isValidHatchifyRoute(ctx.method, ctx.path)) {
        return await next()
      }

      const params = hatchify.getHatchifyURLParamsForRoute(ctx.path)
      if (!params.model) {
        return await next()
      }

      switch (ctx.method) {
        case "GET": {
          if (params.id) {
            ctx.body = await hatchify.everything[params.model].findOne(
              ctx.querystring,
              params.id,
            )
            return
          }
          ctx.body = await hatchify.everything[params.model].findAll(
            ctx.querystring,
          )
          return
        }

        case "POST": {
          const body = await parseHatchifyBody(ctx)

          ctx.body = await hatchify.everything[params.model].create(
            body,
            ctx.querystring,
          )
          return
        }

        case "PATCH": {
          const body = await parseHatchifyBody(ctx)
          if (!params.id) {
            throw new ValidationError({
              status: statusCodes.UNPROCESSABLE_ENTITY,
              code: codes.ERR_INVALID_PARAMETER,
              title: "Invalid ID Provided",
            })
          }
          ctx.body = await hatchify.everything[params.model].update(
            body,
            ctx.querystring,
            params.id,
          )
          return
        }

        case "DELETE": {
          if (!params.id) {
            throw new ValidationError({
              status: statusCodes.UNPROCESSABLE_ENTITY,
              code: codes.ERR_INVALID_PARAMETER,
              title: "Invalid ID Provided",
            })
          }
          ctx.body = await hatchify.everything[params.model].destroy(
            ctx.querystring,
            params.id,
          )
          return
        }

        default: {
          return await next()
        }
      }
    } catch (error) {
      const { errors, status } = errorResponseHandler(error)

      ctx.status = status
      ctx.body = errors
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
