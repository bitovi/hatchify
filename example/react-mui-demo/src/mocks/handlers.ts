import { rest } from "msw"
import { API_BASE_URL } from "@hatchifyjs/react-ui";

const categories: { [key: string]: any } = {
  "category-1": {
    type: "category",
    id: "category-1",
    attributes: {
      name: "Market Analysis",
    },
  },
  "category-2": {
    type: "category",
    id: "category-2",
    attributes: {
      name: "Clinical Document",
    },
  },
  "category-3": {
    type: "category",
    id: "category-3",
    attributes: {
      name: "Financial Report",
    },
  },
}

const users: { [key: string]: any } = {
  "user-1": {
    type: "user",
    id: "user-1",
    attributes: {
      username: "Brian",
    },
  },
  "user-2": {
    type: "user",
    id: "user-2",
    attributes: {
      username: "Tony",
    },
  },
}

const fileTypes: { [key: string]: any } = {
  "fileType-1": {
    type: "fileType",
    id: "fileType-1",
    attributes: {
      name: "PDF",
      mimeType: "application/pdf",
    },
  },
}

const documents: { [key: string]: any } = {
  "document-1": {
    type: "document",
    id: "document-1",
    attributes: {
      title: "Document 1",
      date: new Date().toISOString(),
      url: "https://www.buds.com.ua/images/Lorem_ipsum.pdf",
    },
    relationships: {
      category: {
        data: { type: "category", id: "category-1" },
      },
      user: {
        data: { type: "user", id: "user-1" },
      },
      fileType: {
        data: { type: "fileType", id: "fileType-1" },
      },
    },
  },
  "document-2": {
    type: "document",
    id: "document-2",
    attributes: {
      title: "Document 2",
      date: new Date().toISOString(),
      url: "https://github.com/WolfgangFahl/pdfindexer/blob/master/test/pdfsource1/LoremIpsum.pdf",
    },
    relationships: {
      category: {
        data: { type: "category", id: "category-2" },
      },
      user: {
        data: { type: "user", id: "user-1" },
      },
      fileType: {
        data: { type: "fileType", id: "fileType-1" },
      },
    },
  },
  "document-3": {
    type: "document",
    id: "document-3",
    attributes: {
      title: "Document 3",
      date: new Date().toISOString(),
      url: "https://github.com/WolfgangFahl/pdfindexer/blob/master/test/pdfsource1/LoremIpsum.pdf",
    },
    relationships: {
      category: {
        data: { type: "category", id: "category-3" },
      },
      user: {
        data: { type: "user", id: "user-2" },
      },
      fileType: {
        data: { type: "fileType", id: "fileType-1" },
      },
    },
  },
}

export default [
  rest.get(`${API_BASE_URL}/users`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: Object.values(users),
      }),
    )
  }),
  rest.get(`${API_BASE_URL}/users/:id`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: users[req.params.id as string],
      }),
    )
  }),
  rest.post(`${API_BASE_URL}/users`, async (req, res, ctx) => {
    const json = await req.json()
    const { data } = json
    const newUser = {
      type: "user",
      id: `user-${Object.values(users).length + 1}`,
      attributes: {
        username: data.attributes.username,
      },
    }

    users[newUser.id] = newUser

    return res(
      ctx.json({
        data: users[newUser.id],
      }),
    )
  }),
  rest.get(`${API_BASE_URL}/filetypes`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: Object.values(fileTypes),
      }),
    )
  }),
  rest.get(`${API_BASE_URL}/filetypes/:id`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: fileTypes[req.params.id as string],
      }),
    )
  }),
  rest.post(`${API_BASE_URL}/filetypes`, async (req, res, ctx) => {
    const json = await req.json()
    const { data } = json
    const newFileType = {
      type: "fileType",
      id: `fileType-${Object.values(fileTypes).length + 1}`,
      attributes: {
        name: data.attributes.name,
        mimeType: data.attributes.mimeType,
      },
    }

    fileTypes[newFileType.id] = newFileType

    return res(
      ctx.json({
        data: fileTypes[newFileType.id],
      }),
    )
  }),
  rest.get(`${API_BASE_URL}/categorys`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: Object.values(categories),
      }),
    )
  }),
  rest.get(`${API_BASE_URL}/categorys/:id`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: categories[req.params.id as string],
      }),
    )
  }),
  rest.post(`${API_BASE_URL}/categorys`, async (req, res, ctx) => {
    const json = await req.json()
    const { data } = json
    const newCategory = {
      type: "category",
      id: `category-${Object.values(categories).length + 1}`,
      attributes: {
        name: data.attributes.name,
      },
    }

    categories[newCategory.id] = newCategory

    return res(
      ctx.json({
        data: categories[newCategory.id],
      }),
    )
  }),
  rest.get(`${API_BASE_URL}/documents/:id`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: documents[req.params.id as string],
        included: [
          ...Object.values(categories),
          ...Object.values(users),
          ...Object.values(fileTypes),
        ],
      }),
    )
  }),
  rest.get(`${API_BASE_URL}/documents`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: Object.values(documents),
        included: [
          ...Object.values(categories),
          ...Object.values(users),
          ...Object.values(fileTypes),
        ],
      }),
    )
  }),
  rest.post(`${API_BASE_URL}/documents`, async (req, res, ctx) => {
    const json = await req.json()
    const { data } = json
    const newDocument = {
      type: "document",
      id: `document-${Object.values(documents).length + 1}`,
      attributes: {
        title: data.attributes.title,
        date: data.attributes.date,
        url: data.attributes.url,
      },
      relationships: {
        category: {
          data: {
            type: "category",
            id: data.relationships.category.data[0].id,
          },
        },
        user: {
          data: { type: "user", id: data.relationships.user.data[0].id },
        },
        fileType: {
          data: {
            type: "fileType",
            id: data.relationships.filetype.data[0].id,
          },
        },
      },
    }

    documents[newDocument.id] = newDocument

    return res(
      ctx.json({
        data: documents[newDocument.id],
        included: [
          ...Object.values(categories),
          ...Object.values(users),
          ...Object.values(fileTypes),
        ],
      }),
    )
  }),
]
