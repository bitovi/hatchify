import { assembler, string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"
import type { RestClient } from "../types"

export const ArticleSchema = {
  name: "Article",
  attributes: {
    title: string(),
    body: string(),
  },
  // todo: v2 relationships
  // relationships: {
  //   author: {
  //     type: "one",
  //     schema: "Person",
  //   },
  //   tags: {
  //     type: "many",
  //     schema: "Tag",
  //   },
  // },
} satisfies PartialSchema

export const PersonSchema = {
  name: "Person",
  attributes: {
    name: string(),
  },
  // todo: v2 relationships
  // relationships: {
  //   authored: {
  //     type: "many",
  //     schema: "Article",
  //   },
  // },
} satisfies PartialSchema

export const TagSchema: PartialSchema = {
  name: "Tag",
  attributes: {
    title: string(),
  },
  // todo: v2 relationships
  // relationships: {
  //   articles: {
  //     type: "many",
  //     schema: "Article",
  //   },
  // },
} satisfies PartialSchema

export const partialSchemas = {
  Article: ArticleSchema,
  Person: PersonSchema,
  Tag: TagSchema,
}

export const schemas = assembler(partialSchemas)

export const schemaMap = {
  Article: { type: "article", endpoint: "articles" },
  Person: { type: "person", endpoint: "people" },
  Tag: { type: "tag", endpoint: "tags" },
}

export const testData = [
  {
    id: "article-1",
    __schema: "Article",
    attributes: {
      title: "foo",
      body: "foo-body",
    },
    relationships: {
      author: { id: "person-1", __schema: "Person" },
      tags: [
        { id: "tag-1", __schema: "Tag" },
        { id: "tag-2", __schema: "Tag" },
      ],
    },
  },
  {
    id: "article-2",
    __schema: "Article",
    attributes: {
      title: "foo",
      body: "foo-body",
    },
    relationships: {
      author: { id: "person-1", __schema: "Person" },
      tags: [{ id: "tag-1", __schema: "Tag" }],
    },
  },
  {
    id: "person-1",
    __schema: "Person",
    attributes: { name: "foo" },
  },
  {
    id: "tag-1",
    __schema: "Tag",
    attributes: { title: "tag-1" },
  },
  {
    id: "tag-2",
    __schema: "Tag",
    attributes: { title: "tag-2" },
  },
]

export const testMeta = {
  unpaginatedCount: 2,
}

export const fakeDataSource: RestClient<any> = {
  version: 0,
  completeSchemaMap: {},
  findAll: () => Promise.resolve([testData, testMeta]),
  findOne: () =>
    Promise.resolve([testData[0], testData[2], testData[3], testData[4]]),
  createOne: () =>
    Promise.resolve([
      {
        id: "article-3",
        __schema: "Article",
        attributes: {
          title: "baz",
          body: "baz-body",
        },
      },
    ]),
  updateOne: () =>
    Promise.resolve([
      {
        id: "article-1",
        __schema: "Article",
        attributes: {
          title: "updated title",
          body: "updated body",
        },
      },
    ]),
  deleteOne: () => Promise.resolve(),
}
