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
  [key: string]: any
}

export function getList(
  config: Config,
  query: QueryList,
): Promise<{ data: Record[] }> {
  return fetch(`${config.baseUrl}/${config.resource}`).then((response) =>
    response.json(),
  )
}
