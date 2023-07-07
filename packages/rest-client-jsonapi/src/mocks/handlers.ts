import { rest } from "msw"

export const baseUrl = "http://api.example.com"

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

export const handlers = [
  rest.get(`${baseUrl}/articles`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: testData.data,
        included: testData.included,
        meta: testData.meta,
      }),
    )
  }),

  rest.get(`${baseUrl}/articles/:id`, (req, res, ctx) => {
    const { id } = req.params
    const article = testData.data.find((article) => article.id === id)

    if (!article) {
      return res(ctx.status(404), ctx.json(null))
    }

    return res(ctx.status(200), ctx.json({ data: article }))
  }),

  rest.patch(`${baseUrl}/articles/:id`, async (req, res, ctx) => {
    const { id } = req.params
    const article = testData.data.find((article) => article.id === id)

    if (!article) {
      return res(ctx.status(404), ctx.json(null))
    }

    const {
      data: { attributes },
    } = await req.json()

    const updatedArticle = {
      ...article,
      attributes: {
        ...article.attributes,
        ...attributes,
      },
    }

    testData.data[testData.data.indexOf(article)] = updatedArticle

    return res(ctx.status(200), ctx.json({ data: updatedArticle }))
  }),

  rest.delete(`${baseUrl}/articles/:id`, (req, res, ctx) => {
    const { id } = req.params
    const article = testData.data.find((article) => article.id === id)

    if (!article) {
      return res(ctx.status(404), ctx.json(null))
    }

    testData.data.splice(testData.data.indexOf(article), 1)

    return res(ctx.status(204))
  }),

  rest.post(`${baseUrl}/articles`, async (req, res, ctx) => {
    const {
      data: { attributes },
    } = await req.json()

    const article = {
      type: "article",
      id: `article-id-${testData.data.length + 1}`,
      attributes,
    } as any

    testData.data.push(article)

    return res(ctx.status(201), ctx.json({ data: article }))
  }),
]
