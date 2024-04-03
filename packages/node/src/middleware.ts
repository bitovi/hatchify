import type { ErrorObject } from "json-api-serializer"

import {
  NotFoundError,
  UnexpectedValueError,
  errorResponseHandler,
} from "./error/index.js"
import type { Hatchify } from "./node.js"
import type {
  MiddlewareRequest,
  MiddlewareResponse,
  NextFunction,
} from "./types.js"

export function getMiddlewareFunctions(
  hatchify: Hatchify,
  schemaName: string,
): Record<
  string,
  (
    request: MiddlewareRequest,
    next: NextFunction,
  ) => Promise<MiddlewareResponse | void | Promise<void>>
> {
  return {
    findAll: findAllMiddleware(hatchify, schemaName),
    findOne: findOneMiddleware(hatchify, schemaName),
    findAndCountAll: findAndCountAllMiddleware(hatchify, schemaName),
    create: createMiddleware(hatchify, schemaName),
    destroy: destroyMiddleware(hatchify, schemaName),
    update: updateMiddleware(hatchify, schemaName),
    all: handleAllMiddleware(hatchify),
  }
}

export function findAllMiddleware(hatchify: Hatchify, schemaName: string) {
  return async function findAllImpl(
    { method, path, querystring }: MiddlewareRequest,
    next: NextFunction,
  ): Promise<MiddlewareResponse | ReturnType<Awaited<NextFunction>>> {
    if (method !== "GET") {
      return await next()
    }

    // If this is a wildcard or allModel situation, figure out the model from the route
    if (schemaName === "*") {
      schemaName = resolveWildcard(hatchify, path)
    }

    return {
      body: await hatchify.everything[schemaName].findAll(querystring),
    }
  }
}

export function findOneMiddleware(hatchify: Hatchify, schemaName: string) {
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
    if (schemaName === "*") {
      if (!params.schemaName) {
        return await next()
      }

      schemaName = params.schemaName
    }

    return {
      body: await hatchify.everything[schemaName].findOne(
        querystring,
        params.id,
      ),
    }
  }
}

export function findAndCountAllMiddleware(
  hatchify: Hatchify,
  schemaName: string,
) {
  return async function findAndCountAllImpl(
    { method, path, querystring }: MiddlewareRequest,
    next: NextFunction,
  ): Promise<MiddlewareResponse | ReturnType<Awaited<NextFunction>>> {
    if (method !== "GET") {
      return await next()
    }

    // If this is a wildcard or allModel situation, figure out the model from the route
    if (schemaName === "*") {
      schemaName = resolveWildcard(hatchify, path)
    }

    return {
      body: await hatchify.everything[schemaName].findAndCountAll(querystring),
    }
  }
}

export function createMiddleware(hatchify: Hatchify, schemaName: string) {
  return async function createImpl(
    { body, method, path, querystring }: MiddlewareRequest,
    next: NextFunction,
  ): Promise<MiddlewareResponse | ReturnType<Awaited<NextFunction>>> {
    if (method !== "POST") {
      return await next()
    }

    try {
      // If this is a wildcard or allModel situation, figure out the model from the route
      if (schemaName === "*") {
        schemaName = resolveWildcard(hatchify, path)
      }

      return {
        body: await hatchify.everything[schemaName].create(body, querystring),
      }
    } catch (ex) {
      console.error("error", ex)
      return { body: {} }
    }
  }
}

export function updateMiddleware(hatchify: Hatchify, schemaName: string) {
  return async function updateImpl(
    { body, method, path }: MiddlewareRequest,
    next: NextFunction,
  ): Promise<MiddlewareResponse | ReturnType<Awaited<NextFunction>>> {
    if (method !== "PATCH") {
      return await next()
    }

    // If this is a wildcard or allModel situation, figure out the model from the route
    if (schemaName === "*") {
      schemaName = resolveWildcard(hatchify, path)
    }

    const { id } = hatchify.getHatchifyURLParamsForRoute(path)

    if (!id) {
      return await next()
    }

    return {
      body: await hatchify.everything[schemaName].update(body, id),
    }
  }
}

export function destroyMiddleware(hatchify: Hatchify, schemaName: string) {
  return async function destroyImpl(
    { method, path }: MiddlewareRequest,
    next: NextFunction,
  ): Promise<MiddlewareResponse | ReturnType<Awaited<NextFunction>>> {
    if (method !== "DELETE") {
      return await next()
    }

    // If this is a wildcard or allModel situation, figure out the model from the route
    if (schemaName === "*") {
      schemaName = resolveWildcard(hatchify, path)
    }

    const { id } = hatchify.getHatchifyURLParamsForRoute(path)

    if (!id) {
      return await next()
    }

    return {
      body: await hatchify.everything[schemaName].destroy(id),
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

      const { schemaName, id } = hatchify.getHatchifyURLParamsForRoute(path)

      if (!schemaName) {
        return await next()
      }

      switch (method) {
        case "GET": {
          if (id) {
            return {
              body: await hatchify.everything[schemaName].findOne(
                querystring,
                id,
              ),
            }
          }

          return {
            body: await hatchify.everything[schemaName].findAndCountAll(
              querystring,
            ),
          }
        }

        case "POST": {
          return {
            body: await hatchify.everything[schemaName].create(
              body,
              querystring,
            ),
          }
        }

        case "PATCH": {
          if (!id) {
            throw [
              new UnexpectedValueError({
                detail: "Invalid ID Provided",
                parameter: "id",
              }),
            ]
          }

          return {
            body: await hatchify.everything[schemaName].update(body, id),
          }
        }

        case "DELETE": {
          if (!id) {
            throw [
              new UnexpectedValueError({
                detail: "Invalid ID Provided",
                parameter: "id",
              }),
            ]
          }

          return {
            body: await hatchify.everything[schemaName].destroy(id),
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
  const { schemaName } = hatchify.getHatchifyURLParamsForRoute(path)
  if (!schemaName) {
    throw [
      new UnexpectedValueError({
        detail: "Invalid URL Format",
        parameter: "schemaName",
      }),
    ]
  }

  if (!hatchify.orm.models[schemaName]) {
    throw [new NotFoundError({ detail: `Schema ${schemaName} was not found` })]
  }

  return schemaName
}
