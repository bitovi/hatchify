import type { Source, SourceConfig, QueryList, Resource } from "data-core"

export const data: Record<string, any[]> = {
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
    data: data[config.url].map((resource) => {
      return {
        __schema: schema,
        ...resource,
      }
    }),
  })
}

export function fixtures(config: SourceConfig): Source {
  return {
    version: 0,
    getList: (schema: string, query: QueryList) =>
      getList(config, schema, query),
  }
}
