import type { CreateData, SourceConfig, Resource } from "data-core"

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
