import type { SourceConfig, QueryOne, Resource } from "data-core"

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
