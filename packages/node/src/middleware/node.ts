import type { ErrorObject } from "json-api-serializer"

import { errorResponseHandler } from "../error"
import { codes, statusCodes } from "../error/constants"
import { ValidationError } from "../error/errors"
import type { Hatchify } from "../node"
import type {
  MiddlewareRequest,
  MiddlewareResponse,
  NextFunction,
} from "../types"

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
            body: await hatchify.everything[params.model].findAndCountAll(
              querystring,
            ),
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

      return {
        status,
        body: { jsonapi: { version: "1.0" }, errors: errors as ErrorObject[] },
      }
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
