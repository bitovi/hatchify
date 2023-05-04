import type { Config, DataSource, QueryList, Record } from "hatchify-core"

export function getList(
  config: Config,
  query: QueryList, // @todo implement query for fields, page, sort, and filter
): Promise<{ data: Record[] }> {
  return fetch(`${config.baseUrl}/${config.resource}`).then((response) =>
    response.json(),
  )
}

export function jsonapi(config: { baseUrl: string }): DataSource {
  return {
    getList: (resource: string, query: QueryList) =>
      getList({ baseUrl: config.baseUrl, resource }, query),
  }
}
