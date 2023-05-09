import type {
  CreateData,
  Source,
  SourceConfig,
  QueryList,
  Resource,
} from "data-core"

export const fixtureData: Record<string, any[]> = {
  articles: [
    {
      id: "article-1",
      attributes: {
        title: "Article 1",
        body: "Body 1",
      },
    },
    {
      id: "article-2",
      attributes: {
        title: "Article 2",
        body: "Body 2",
      },
    },
    {
      id: "article-3",
      attributes: {
        title: "Article 3",
        body: "Body 3",
      },
    },
  ],
}

export function getList(
  config: SourceConfig,
  schema: string,
  query: QueryList,
): Promise<{ data: Resource[] }> {
  return Promise.resolve({
    data: fixtureData[config.url].map((resource) => {
      return {
        __schema: schema,
        ...resource,
      }
    }),
  })
}

export function createOne(
  config: SourceConfig,
  schema: string,
  data: CreateData,
): Promise<{ data: Resource }> {
  const resource = {
    id: `${config.url}-${fixtureData[config.url].length + 1}`,
    ...data,
  }

  fixtureData[config.url].push(resource)

  return Promise.resolve({
    data: {
      __schema: schema,
      ...resource,
    } as Resource,
  })
}

export function fixtures(config: SourceConfig): Source {
  return {
    version: 0,
    getList: (schema: string, query: QueryList) =>
      getList(config, schema, query),
    createOne: (schema: string, data: CreateData) =>
      createOne(config, schema, data),
  }
}
