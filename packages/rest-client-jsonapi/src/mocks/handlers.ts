/* c8 ignore start */
import type { HttpHandler } from "msw";
import { http } from "msw"
import { assembler, hasMany, hasOne, string } from "@hatchifyjs/core"
import type { RestClientSchema } from "@hatchifyjs/rest-client"

export const baseUrl = "http://api.example.com"

export const partialSchemas = {
  Article: {
    name: "Article",
    attributes: {
      title: string(),
      body: string(),
    },
    relationships: {
      author: hasOne("Person"),
      tags: hasMany("Tag"),
    },
    type: "article",
    endpoint: "articles",
  },
  Person: {
    name: "Person",
    attributes: {},
    type: "person",
    endpoint: "people",
  },
  Tag: { name: "Tag", attributes: {}, type: "tag", endpoint: "tags" },
} satisfies globalThis.Record<string, RestClientSchema>

export const restClientConfig = { baseUrl, schemaMap: partialSchemas }
export const finalSchemas = assembler(partialSchemas)

export const testData = {
  data: [
    {
      type: "article",
      id: "article-id-1",
      attributes: {
        title: "Article 1",
        body: "Article 1 body",
      },
      relationships: {
        author: { data: { id: "person-id-1", type: "person" } },
        tags: {
          data: [
            { id: "tag-id-1", type: "tag" },
            { id: "tag-id-2", type: "tag" },
          ],
        },
      },
    },
    {
      type: "article",
      id: "article-id-2",
      attributes: {
        title: "Article 2",
        body: "Article 2 body",
      },
      relationships: {
        author: { data: { id: "person-id-1", type: "person" } },
        tags: {
          data: [{ id: "tag-id-1", type: "tag" }],
        },
      },
    },
    {
      type: "article",
      id: "article-id-3",
      attributes: {
        title: "Article 3",
        body: "Article 3 body",
      },
      relationships: {
        author: { data: { id: "person-id-2", type: "person" } },
        tags: {
          data: [{ id: "tag-id-2", type: "tag" }],
        },
      },
    },
  ],
  included: [
    {
      type: "person",
      id: "person-id-1",
      attributes: {
        name: "Person 1",
      },
    },
    {
      type: "person",
      id: "person-id-2",
      attributes: {
        name: "Person 2",
      },
    },
    {
      type: "tag",
      id: "tag-id-1",
      attributes: {
        title: "Tag 1",
      },
    },
    {
      type: "tag",
      id: "tag-id-2",
      attributes: {
        title: "Tag 2",
      },
    },
  ],
  meta: {
    unpaginatedCount: 3,
  },
}

export const handlers: HttpHandler[] = [
  http.get(`${baseUrl}/articles`, () => {
    return new Response(
      JSON.stringify({
        data: testData.data,
        included: testData.included,
        meta: testData.meta,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      },
    )
  }),

  http.get(`${baseUrl}/articles/:id`, ({ params }) => {
    const { id } = params
    const article = testData.data.find((article) => article.id === id)

    if (!article) {
      return new Response("null", {
        headers: { "Content-Type": "application/json" },
        status: 404,
      })
    }

    return new Response(JSON.stringify({ data: article }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  }),

  http.patch(`${baseUrl}/articles/:id`, async ({ request, params }) => {
    const { id } = params
    const article = testData.data.find((article) => article.id === id)

    if (!article) {
      return new Response("null", {
        headers: { "Content-Type": "application/json" },
        status: 404,
      })
    }

    const {
      data: { attributes },
    } = (await request.json()) as any

    const updatedArticle = {
      ...article,
      attributes: {
        ...article.attributes,
        ...attributes,
      },
    }

    testData.data[testData.data.indexOf(article)] = updatedArticle

    return new Response(JSON.stringify({ data: updatedArticle }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  }),

  http.delete(`${baseUrl}/articles/:id`, ({ params }) => {
    const { id } = params
    const article = testData.data.find((article) => article.id === id)

    if (!article) {
      return new Response("null", {
        headers: { "Content-Type": "application/json" },
        status: 404,
      })
    }

    testData.data.splice(testData.data.indexOf(article), 1)

    return new Response(undefined, {
      status: 204,
    })
  }),

  http.post(`${baseUrl}/articles`, async ({ request }) => {
    const {
      data: { attributes },
    } = (await request.json()) as any

    const article = {
      type: "article",
      id: `article-id-${testData.data.length + 1}`,
      attributes,
    } as any

    testData.data.push(article)

    return new Response(JSON.stringify({ data: article }), {
      status: 201,
    })
  }),
]
/* c8 ignore stop */
