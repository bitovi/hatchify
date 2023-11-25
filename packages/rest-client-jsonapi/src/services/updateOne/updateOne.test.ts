import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import {
  baseUrl,
  finalSchemas,
  partialSchemas,
  restClientConfig,
  testData,
} from "../../mocks/handlers"
import { server } from "../../mocks/server"
import jsonapi from "../../rest-client-jsonapi"
import { updateOne } from "./updateOne"
import { convertToHatchifyResources } from "../utils"
import type { JsonApiResource } from "../jsonapi"

describe("rest-client-jsonapi/services/updateOne", () => {
  it("works", async () => {
    const data = {
      __schema: "Article",
      id: "article-id-1",
      attributes: { title: "A new world!" },
    }

    const toUpdate = testData.data.find((d) => d.id === data.id)

    const expected = {
      record: convertToHatchifyResources(
        {
          ...toUpdate,
          attributes: {
            ...toUpdate?.attributes,
            title: "A new world!",
          },
        } as JsonApiResource,
        partialSchemas,
      )[0],
      related: [],
    }
    // const expected = [
    //   {
    //     __schema: "Article",
    //     id: "article-id-1",
    //     attributes: {
    //       title: "A new world!",
    //       body: "Article 1 body",
    //     },
    //     relationships: {
    //       author: {
    //         __schema: "Person",
    //         id: "person-id-1",
    //       },
    //       tags: [
    //         {
    //           __schema: "Tag",
    //           id: "tag-id-1",
    //         },
    //         {
    //           __schema: "Tag",
    //           id: "tag-id-2",
    //         },
    //       ],
    //     },
    //   },
    // ]

    const result = await updateOne<typeof partialSchemas, "Article">(
      restClientConfig,
      finalSchemas,
      "Article",
      data,
    )
    expect(result).toEqual(expected)
  })

  it("throws an error if the request fails", async () => {
    const errors = [
      {
        code: "resource-conflict-occurred",
        source: { pointer: "name" },
        status: 409,
        title: "Record with name already exists",
      },
    ]

    server.use(
      rest.patch(`${baseUrl}/articles/article-id-1`, (_, res, ctx) =>
        res.once(ctx.status(500), ctx.json({ errors })),
      ),
    )

    await expect(() =>
      updateOne(restClientConfig, finalSchemas, "Article", {
        __schema: "Article",
        id: "article-id-1",
      }),
    ).rejects.toEqual(errors)
  })

  it("can be called from a rest client", async () => {
    const dataSource = jsonapi(baseUrl, partialSchemas)
    const data = {
      __schema: "Article",
      id: "article-id-1",
      attributes: { title: "Hello, World!" },
    }
    const spy = vi.spyOn(dataSource, "updateOne")

    await dataSource.updateOne(finalSchemas, "Article", data)

    expect(spy).toHaveBeenCalledWith(finalSchemas, "Article", data)
  })
})
