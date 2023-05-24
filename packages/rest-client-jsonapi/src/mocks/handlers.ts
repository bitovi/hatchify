import { rest } from "msw"

export const baseUrl = "http://api.example.com"

export const articles = [
  {
    type: "Article",
    id: "article-id-1",
    attributes: {
      title: "Article 1",
      body: "Article 1 body",
    },
  },
  {
    type: "Article",
    id: "article-id-2",
    attributes: {
      title: "Article 2",
      body: "Article 2 body",
    },
  },
  {
    type: "Article",
    id: "article-id-3",
    attributes: {
      title: "Article 3",
      body: "Article 3 body",
    },
  },
]

export const handlers = [
  rest.get(`${baseUrl}/articles`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ data: articles }))
  }),

  rest.get(`${baseUrl}/articles/:id`, (req, res, ctx) => {
    const { id } = req.params
    const article = articles.find((article) => article.id === id)

    if (!article) {
      return res(ctx.status(404), ctx.json(null))
    }

    return res(ctx.status(200), ctx.json({ data: article }))
  }),

  rest.patch(`${baseUrl}/articles/:id`, async (req, res, ctx) => {
    const { id } = req.params
    const article = articles.find((article) => article.id === id)

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

    articles[articles.indexOf(article)] = updatedArticle

    return res(ctx.status(200), ctx.json({ data: updatedArticle }))
  }),

  rest.post(`${baseUrl}/articles`, async (req, res, ctx) => {
    const {
      data: { attributes },
    } = await req.json()

    const article = {
      type: "Article",
      id: `article-id-${articles.length + 1}`,
      attributes,
    }

    articles.push(article)

    return res(ctx.status(201), ctx.json({ data: article }))
  }),
]
