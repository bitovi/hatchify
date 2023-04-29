export interface Config {
  baseUrl: string
  resource: string
}

export interface QueryList {
  fields?: string[]
  page?: { size: number; number: number }
  sort?: { [key: string]: "asc" | "desc" }
  filter?: { [key: string]: { [filter: string]: string } }
}

export interface Record {
  id: string
  [key: string]: any // @todo strict typing
}

export function getList(
  config: Config,
  query: QueryList,
): Promise<{ data: Record[] }> {
  return fetch(`${config.baseUrl}/${config.resource}`).then((response) =>
    response.json(),
  )
}

export interface DataSource {
  getList: (resource: string, query: QueryList) => Promise<{ data: Record[] }>
}

export function jsonapi(config: { baseUrl: string }): DataSource {
  return {
    getList: (resource: string, query: QueryList) =>
      getList({ baseUrl: config.baseUrl, resource }, query),
  }
}
