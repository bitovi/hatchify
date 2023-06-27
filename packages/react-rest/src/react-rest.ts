import { hatchifyReactRest } from "./services"

export type { ReactRest, SchemaRecord } from "./services"

export {
  useCreateOne,
  useDeleteOne,
  useAll,
  useOne,
  useUpdateOne,
} from "./services"

export default hatchifyReactRest
