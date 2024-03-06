import type {
  Hatchify,
  HatchifyError,
  MiddlewareRequest,
} from "@hatchifyjs/node"
import {
  errorResponseHandler,
  getMiddlewareFunctions,
  parseHatchifyBody,
} from "@hatchifyjs/node"
import type { NextFunction, Request, Response } from "express"

export type ExpressMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void

/**
 * Provides a set of exported functions, per Model, that
 * provide Express Middleware for each operation
 */
export interface MiddlewareFunctionsExpress {
  /**
   * Search for multiple instances.
   */
  findAll: ExpressMiddleware
  /**
   * Search for a single instance. Returns the first instance found, or null if none can be found.
   */
  findOne: ExpressMiddleware
  /**
   * Find all the rows matching your query, within a specified offset / limit, and get the total number of rows matching your query. This is very useful for paging.
   */
  findAndCountAll: ExpressMiddleware
  /**
   * Creates a new instance.
   */
  create: ExpressMiddleware
  /**
   * Updates an existing single instance.
   */
  update: ExpressMiddleware
  /**
   * Deletes one or more instances.
   */
  destroy: ExpressMiddleware

  /**
   * The `middleware.allModels.all` Middleware provides the primary hooks
   * between your Express application and the Hatchify library
   *
   * It will use the Express Context to determine if:
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
   * @return {ExpressMiddleware} Express Middleware function that can be attached to a Express instance (`app`) using `app.use`
   * @category General Use
   */
  all: ExpressMiddleware
}

export function buildMiddlewareForModel(
  hatchify: Hatchify,
  modelName: string,
): MiddlewareFunctionsExpress {
  return Object.entries(getMiddlewareFunctions(hatchify, modelName)).reduce(
    (acc, [name, genericFunction]) => ({
      ...acc,
      [name]: async (req: Request, res: Response, next: NextFunction) => {
        const request: MiddlewareRequest = {
          body: ["POST", "PATCH"].includes(req.method)
            ? await parseHatchifyBody(req)
            : undefined,
          errorCallback: (statusCode: number, errorCode: string) =>
            res.status(statusCode).send(errorCode),
          method: req.method,
          path: req.path,
          querystring: req.originalUrl.split("?")[1] || "",
        }

        const response = await genericFunction(request, async () => next())

        if (response) {
          return res.status(response.status || 200).json(response.body)
        }

        return next()
      },
    }),
    {} as MiddlewareFunctionsExpress,
  )
}

export async function errorHandlerMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await next()
  } catch (ex) {
    const { errors, status } = errorResponseHandler(
      ex as Error | HatchifyError[],
    )

    res.status(status).json({ jsonapi: { version: "1.0" }, errors })
  }
}
