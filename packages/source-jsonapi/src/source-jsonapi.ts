import type {
  CreateData,
  Source,
  SourceConfig,
  QueryList,
  QueryOne,
  Resource,
} from "data-core"

/**
 * Fetches a list of resources, adds the __schema to each resource, and
 * returns them.
 */
export async function getList(
  config: SourceConfig,
  schema: string,
  query: QueryList, // @todo query for fields, page, sort, and filter
): Promise<{ data: Resource[] }> {
  const response = await fetch(`${config.url}`)

  // @todo proper validation
  if (!response.ok) {
    throw Error("failed to fetch list")
  }

  const data = await response.json()

  return Promise.resolve({
    data: data.data.map((record: any) => ({
      __schema: schema,
      ...record,
    })),
  })
}

/**
 * Fetches a single resource, adds the __schema to the request response,
 * and returns it.
 */
export async function getOne(
  config: SourceConfig,
  schema: string,
  query: QueryOne,
): Promise<{ data: Resource }> {
  const response = await fetch(`${config.url}/${query.id}`)

  // @todo proper validation
  if (!response.ok) {
    throw Error("failed to fetch record")
  }

  const record = await response.json()

  return Promise.resolve({
    data: {
      __schema: schema,
      ...record.data,
    },
  })
}

/**
 * Creates a new resource, adds the __schema to the request response,
 * and returns it.
 */
export async function createOne(
  config: SourceConfig,
  schema: string,
  data: CreateData,
): Promise<{ data: Resource }> {
  const response = await fetch(`${config.url}`, {
    method: "POST",
    body: JSON.stringify({ data }),
  })

  // @todo proper validation
  if (!response.ok) {
    throw Error("failed to create record")
  }

  const record = await response.json()

  return Promise.resolve({
    data: {
      __schema: schema,
      ...record.data,
    },
  })
}

/**
 * Creates a new JSON:API Source.
 */
export function jsonapi(config: SourceConfig): Source {
  return {
    version: 0,
    getList: (schema: string, query: QueryList) =>
      getList(config, schema, query),
    getOne: (schema: string, query: QueryOne) => getOne(config, schema, query),
    createOne: (schema: string, data: CreateData) =>
      createOne(config, schema, data),
  }
}
