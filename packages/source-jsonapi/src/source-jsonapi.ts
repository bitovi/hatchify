import type {
  CreateData,
  Source,
  SourceConfig,
  QueryList,
  Resource,
} from "data-core"

export async function getList(
  config: SourceConfig,
  schema: string,
  query: QueryList, // @todo implement query for fields, page, sort, and filter
): Promise<{ data: Resource[] }> {
  const response = await fetch(`${config.url}`)
  const data = await response.json()

  return Promise.resolve({
    data: data.data.map((record: any) => ({
      __schema: schema,
      ...record,
    })),
  })
}

export async function createOne(
  config: SourceConfig,
  schema: string,
  data: CreateData,
): Promise<{ data: Resource }> {
  const response = await fetch(`${config.url}`, {
    method: "POST",
    body: JSON.stringify({ data }),
  })
  const record = await response.json()

  return Promise.resolve({
    data: {
      __schema: schema,
      ...record.data,
    },
  })
}

export function jsonapi(config: SourceConfig): Source {
  return {
    version: "0.0.0",
    getList: (schema: string, query: QueryList) =>
      getList(config, schema, query),
    createOne: (schema: string, data: CreateData) =>
      createOne(config, schema, data),
  }
}
