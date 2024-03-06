import type { ErrorObject } from "json-api-serializer"

import { codes, statusCodes } from "../error/constants.js"
import { ValidationError, errorResponseHandler } from "../error/index.js"
import type { Hatchify } from "../node.js"
import type {
  MiddlewareRequest,
  MiddlewareResponse,
  NextFunction,
} from "../types.js"

export function getMiddlewareFunctions(
  hatchify: Hatchify,
): Record<
  string,
  (
    request: MiddlewareRequest,
    next: NextFunction,
  ) => Promise<MiddlewareResponse | void | Promise<void>>
> {
  return {
    findAll: findAllMiddleware(hatchify),
    findOne: findOneMiddleware(hatchify),
    findAndCountAll: findAndCountAllMiddleware(hatchify),
    create: createMiddleware(hatchify),
    destroy: destroyMiddleware(hatchify),
    update: updateMiddleware(hatchify),
    all: handleAllMiddleware(hatchify),
  }
}

export function findAllMiddleware(hatchify: Hatchify) {
  return async function findAllImpl({
    path,
    querystring,
  }: MiddlewareRequest): Promise<MiddlewareResponse> {
    const modelName = resolveWildcard(hatchify, path)

    return {
      body: await hatchify.everything[modelName].findAll(querystring),
    }
  }
}

export function findOneMiddleware(hatchify: Hatchify) {
  return async function findOneImpl({
    errorCallback,
    path,
    querystring,
  }: MiddlewareRequest): Promise<MiddlewareResponse> {
    const modelName = resolveWildcard(hatchify, path)
    const params = hatchify.getHatchifyURLParamsForRoute(path)
    if (!params.id) {
      throw errorCallback(400, "BAD_REQUEST")
    }

    return {
      body: await hatchify.everything[modelName].findOne(
        querystring,
        params.id,
      ),
    }
  }
}

export function findAndCountAllMiddleware(hatchify: Hatchify) {
  return async function findAndCountAllImpl({
    path,
    querystring,
  }: MiddlewareRequest): Promise<MiddlewareResponse> {
    const modelName = resolveWildcard(hatchify, path)

    return {
      body: await hatchify.everything[modelName].findAndCountAll(querystring),
    }
  }
}

export function createMiddleware(hatchify: Hatchify) {
  return async function createImpl({
    body,
    path,
    querystring,
  }: MiddlewareRequest): Promise<MiddlewareResponse> {
    try {
      const modelName = resolveWildcard(hatchify, path)

      return {
        body: await hatchify.everything[modelName].create(body, querystring),
      }
    } catch (ex) {
      console.error("error", ex)
      return { body: {} }
    }
  }
}

export function updateMiddleware(hatchify: Hatchify) {
  return async function updateImpl({
    body,
    errorCallback,
    path,
  }: MiddlewareRequest): Promise<MiddlewareResponse> {
    const modelName = resolveWildcard(hatchify, path)
    const { id } = hatchify.getHatchifyURLParamsForRoute(path)

    if (!id) {
      throw errorCallback(400, "BAD_REQUEST")
    }

    return {
      body: await hatchify.everything[modelName].update(body, id),
    }
  }
}

export function destroyMiddleware(hatchify: Hatchify) {
  return async function destroyImpl({
    errorCallback,
    path,
  }: MiddlewareRequest): Promise<MiddlewareResponse> {
    const modelName = resolveWildcard(hatchify, path)
    const { id } = hatchify.getHatchifyURLParamsForRoute(path)

    if (!id) {
      throw errorCallback(400, "BAD_REQUEST")
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

function resolveWildcard(hatchify: Hatchify, path: string): string {
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
