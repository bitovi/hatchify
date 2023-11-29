import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import {
  baseUrl,
  finalSchemas,
  partialSchemas,
  restClientConfig,
} from "../../mocks/handlers"
import { server } from "../../mocks/server"
import jsonapi from "../../rest-client-jsonapi"
import { createOne } from "./createOne"
import { convertToHatchifyResources } from "../utils"
import type { JsonApiResource } from "../jsonapi"

describe("rest-client-jsonapi/services/createOne", () => {
  it("works", async () => {
    const data = { __schema: "Article", attributes: { title: "Hello, World!" } }

    const expected = {
      record: convertToHatchifyResources(
        {
          type: "article",
          id: "article-id-4",
          attributes: {
            title: "Hello, World!",
          },
        } as JsonApiResource,
        partialSchemas,
      )[0],
      related: [],
    }

    const result = await createOne<typeof partialSchemas, "Article">(
      restClientConfig,
      finalSchemas,
      "Article",
      data,
    )
    expect(result).toEqual(expected)
  })

  it("throws an error if the request fails", async () => {
    const data = { __schema: "Article", attributes: { title: "Hello, World!" } }

    const errors = [
      {
        code: "resource-conflict-occurred",
        source: { pointer: "name" },
        status: 409,
        title: "Record with name already exists",
      },
    ]

    server.use(
      rest.post(`${baseUrl}/articles`, (_, res, ctx) =>
        res.once(
          ctx.status(500),
          ctx.json({
            errors,
          }),
        ),
      ),
    )

    await expect(() =>
      createOne<typeof partialSchemas, "Article">(
        restClientConfig,
        finalSchemas,
        "Article",
        data,
      ),
    ).rejects.toEqual(errors)
  })

  it("can be called from a rest client", async () => {
    const dataSource = jsonapi(baseUrl, partialSchemas)
    const data = { __schema: "Article", attributes: { title: "Hello, World!" } }
    const spy = vi.spyOn(dataSource, "createOne")

    await dataSource.createOne(finalSchemas, "Article", data)

    expect(spy).toHaveBeenCalledWith(finalSchemas, "Article", data)
  })
})
