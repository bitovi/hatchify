import type {
  Config,
  DataSource,
  QueryList,
  Record as HatchifyRecord,
} from "hatchify-core"

export const data: Record<string, HatchifyRecord[]> = {
  articles: [
    {
      id: "article-1",
      title: "Article 1",
      body: "Body 1",
    },
    {
      id: "article-2",
      title: "Article 2",
      body: "Body 2",
    },
    {
      id: "article-3",
      title: "Article 3",
      body: "Body 3",
    },
  ],
}

export function getList(
  config: Omit<Config, "baseUrl">,
  query: QueryList,
): Promise<{ data: HatchifyRecord[] }> {
  return Promise.resolve({ data: data[config.resource] })
}

export function fixtures(): DataSource {
  return {
    getList: (resource: string, query: QueryList) =>
      getList({ resource }, query),
  }
}
