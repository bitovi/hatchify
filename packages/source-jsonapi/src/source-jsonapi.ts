import type { Source, SourceConfig, QueryList, Record } from "data-core"

export function getList(
  config: SourceConfig,
  query: QueryList, // @todo implement query for fields, page, sort, and filter
): Promise<{ data: Record[] }> {
  return fetch(`${config.baseUrl}/${config.resource}`).then((response) =>
    response.json(),
  )
}

export function jsonapi(config: { baseUrl: string }): Source {
  return {
    getList: (resource: string, query: QueryList) =>
      getList({ baseUrl: config.baseUrl, resource }, query),
  }
}
