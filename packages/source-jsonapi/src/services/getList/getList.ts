import type {
  Schema,
  SourceConfig,
  QueryList,
  Resource,
} from "@hatchifyjs/data-core"

/**
 * Fetches a list of resources, adds the __schema to each resource, and
 * returns them.
 */
export async function getList(
  config: SourceConfig,
  schema: Schema,
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
      ...record,
      __schema: schema.name,
    })),
  })
}
