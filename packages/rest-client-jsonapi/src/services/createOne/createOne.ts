import type {
  CreateData,
  Schemas,
  SourceConfig,
  Resource,
} from "@hatchifyjs/rest-client"
import { convertToHatchifyResources, fetchJsonApi } from "../utils"
import type { JsonApiResource } from "../jsonapi"

/**
 * Creates a new resource, adds the __schema to the request response,
 * and returns it.
 */
export async function createOne(
  config: SourceConfig,
  allSchemas: Schemas,
  schemaName: string,
  data: Omit<CreateData, "type">,
): Promise<Resource[]> {
  const createData = { ...data, type: schemaName }

  const json = await fetchJsonApi<JsonApiResource>(
    "POST",
    `${config.baseUrl}/${config.schemaMap[schemaName].endpoint}`,
    createData,
  )

  return Promise.resolve(
    convertToHatchifyResources(
      [json.data, ...(json.included || [])],
      config.schemaMap,
    ),
  )
}
