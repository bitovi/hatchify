import type { Resource } from "@hatchifyjs/rest-client"
import type { JsonApiResource } from "../../jsonapi"

/**
 * Converts a JSON:API resource into a hatchify record.
 */
export function jsonApiResourceToRecord(
  resource: JsonApiResource,
  schemaName: string,
): Resource {
  return {
    attributes: resource.attributes,
    // todo relationships
    id: resource.id.toString(),
    __schema: schemaName,
  }
}

/**
 * Converts JSON:API resources into hatchify records.
 */
export function convertToRecords(
  data: JsonApiResource | JsonApiResource[],
  schemaName: string,
): Resource[] {
  if (Array.isArray(data)) {
    return data.map((d) => jsonApiResourceToRecord(d, schemaName))
  }
  return [jsonApiResourceToRecord(data, schemaName)]
}
