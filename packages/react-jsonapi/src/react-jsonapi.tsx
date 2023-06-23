import { jsonapi as createJsonapiClient } from "@hatchifyjs/rest-client-jsonapi"
import { hatchifyReactRest } from "@hatchifyjs/react-rest"
import type {
  ReactRest,
  RestSource,
  SchemaRecord,
} from "@hatchifyjs/react-rest"

export function reactJsonapi(
  schema: SchemaRecord,
  dataSource: any,
): ReactRest<SchemaRecord> {
  const butts = createJsonapiClient("http://localhost:3000/api", schema)
  return hatchifyReactRest(schema, dataSource)
}
