import { hatchifyReactRest } from "./services"

export type { ReactRest, SchemaRecord } from "./services"
export type { Schema } from "@hatchifyjs/rest-client"

export {
  useCreateOne,
  useDeleteOne,
  useAll,
  useOne,
  useUpdateOne,
} from "./services"

export default hatchifyReactRest

export { hatchifyV2 } from "./services"
