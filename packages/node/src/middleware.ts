import type { ErrorObject } from "json-api-serializer"

import { codes, statusCodes } from "./error/constants.js"
import { ValidationError, errorResponseHandler } from "./error/index.js"
import type { Hatchify } from "./node.js"
import type {
  MiddlewareRequest,
  MiddlewareResponse,
  NextFunction,
} from "./types.js"

export function getMiddlewareFunctions(
  hatchify: Hatchify,
  modelName: string,
): Record<
  string,
  (
    request: MiddlewareRequest,
    next: NextFunction,
  ) => Promise<MiddlewareResponse | void | Promise<void>>
> {
  return {
    findAll: findAllMiddleware(hatchify, modelName),
    findOne: findOneMiddleware(hatchify, modelName),
    findAndCountAll: findAndCountAllMiddleware(hatchify, modelName),
    create: createMiddleware(hatchify, modelName),
    destroy: destroyMiddleware(hatchify, modelName),
    update: updateMiddleware(hatchify, modelName),
    all: handleAllMiddleware(hatchify),
  }
}

export function findAllMiddleware(hatchify: Hatchify, modelName: string) {
  return async function findAllImpl(
    { method, path, querystring }: MiddlewareRequest,
    next: NextFunction,
  ): Promise<MiddlewareResponse | ReturnType<Awaited<NextFunction>>> {
    if (method !== "GET") {
      return await next()
    }

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
  return async function findOneImpl(
    { method, path, querystring }: MiddlewareRequest,
    next: NextFunction,
  ): Promise<MiddlewareResponse | ReturnType<Awaited<NextFunction>>> {
    if (method !== "GET") {
      return await next()
    }

    const params = hatchify.getHatchifyURLParamsForRoute(path)

    if (!params.id) {
      return await next()
    }

    // If this is a wildcard or allModel situation, figure out the model from the route
    if (modelName === "*") {
      if (!params.modelName) {
        return await next()
      }

      modelName = params.modelName
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
  return async function findAndCountAllImpl(
    { method, path, querystring }: MiddlewareRequest,
    next: NextFunction,
  ): Promise<MiddlewareResponse | ReturnType<Awaited<NextFunction>>> {
    if (method !== "GET") {
      return await next()
    }

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
    { body, method, path, querystring }: MiddlewareRequest,
    next: NextFunction,
  ): Promise<MiddlewareResponse | ReturnType<Awaited<NextFunction>>> {
    if (method !== "POST") {
      return await next()
    }

    try {
      // If this is a wildcard or allModel situation, figure out the model from the route
      if (modelName === "*") {
        modelName = resolveWildcard(hatchify, path)
      }

      return {
        body: await hatchify.everything[modelName].create(body, querystring),
      }
    } catch (ex) {
      console.error("error", ex)
      return { body: {} }
    }
  }
}

export function updateMiddleware(hatchify: Hatchify, modelName: string) {
  return async function updateImpl(
    { body, method, path }: MiddlewareRequest,
    next: NextFunction,
  ): Promise<MiddlewareResponse | ReturnType<Awaited<NextFunction>>> {
    if (method !== "PATCH") {
      return await next()
    }

    // If this is a wildcard or allModel situation, figure out the model from the route
    if (modelName === "*") {
      modelName = resolveWildcard(hatchify, path)
    }

    const { id } = hatchify.getHatchifyURLParamsForRoute(path)

    if (!id) {
      return await next()
    }

    return {
      body: await hatchify.everything[modelName].update(body, id),
    }
  }
}

export function destroyMiddleware(hatchify: Hatchify, modelName: string) {
  return async function destroyImpl(
    { method, path }: MiddlewareRequest,
    next: NextFunction,
  ): Promise<MiddlewareResponse | ReturnType<Awaited<NextFunction>>> {
    if (method !== "DELETE") {
      return await next()
    }

    // If this is a wildcard or allModel situation, figure out the model from the route
    if (modelName === "*") {
      modelName = resolveWildcard(hatchify, path)
    }

    const { id } = hatchify.getHatchifyURLParamsForRoute(path)

    if (!id) {
      return await next()
    }

    return {
      body: await hatchify.everything[modelName].destroy(id),
    }
  }
}

export function handleAllMiddleware(hatchify: Hatchify) {
  return async function handleAllImpl(
    { body, method, path, querystring }: MiddlewareRequest,
    next: NextFunction,
  ): Promise<MiddlewareResponse | ReturnType<Awaited<NextFunction>>> {
    try {
      // Check if this request URL takes the format of one that we expect
      if (!hatchify.isValidHatchifyRoute(method, path)) {
        return await next()
      }

      const { modelName, id } = hatchify.getHatchifyURLParamsForRoute(path)

      if (!modelName) {
        return await next()
      }

      switch (method) {
        case "GET": {
          if (id) {
            return {
              body: await hatchify.everything[modelName].findOne(
                querystring,
                id,
              ),
            }
          }

          return {
            body: await hatchify.everything[modelName].findAndCountAll(
              querystring,
            ),
          }
        }

        case "POST": {
          return {
            body: await hatchify.everything[modelName].create(
              body,
              querystring,
            ),
          }
        }

        case "PATCH": {
          if (!id) {
            throw [
              new ValidationError({
                status: statusCodes.UNPROCESSABLE_ENTITY,
                code: codes.ERR_INVALID_PARAMETER,
                title: "Invalid ID Provided",
              }),
            ]
          }

          return {
            body: await hatchify.everything[modelName].update(body, id),
          }
        }

        case "DELETE": {
          if (!id) {
            throw [
              new ValidationError({
                status: statusCodes.UNPROCESSABLE_ENTITY,
                code: codes.ERR_INVALID_PARAMETER,
                title: "Invalid ID Provided",
              }),
            ]
          }

          return {
            body: await hatchify.everything[modelName].destroy(id),
          }
        }

        default: {
          return await next()
        }
      }
    } catch (error) {
      const { errors, status } = errorResponseHandler(error as Error)

      return {
        status,
        body: { jsonapi: { version: "1.0" }, errors: errors as ErrorObject[] },
      }
    }
  }
}

export function resolveWildcard(hatchify: Hatchify, path: string): string {
  const { modelName } = hatchify.getHatchifyURLParamsForRoute(path)
  if (!modelName) {
    throw [
      new ValidationError({
        status: statusCodes.UNPROCESSABLE_ENTITY,
        code: codes.ERR_INVALID_PARAMETER,
        title: "Invalid URL Format",
      }),
    ]
  }

  if (!hatchify.orm.models[modelName]) {
    throw [
      new ValidationError({
        status: statusCodes.UNPROCESSABLE_ENTITY,
        code: codes.ERR_INVALID_PARAMETER,
        title: "Bad Model Name: ",
      }),
    ]
  }

  return modelName
}
