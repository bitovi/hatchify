import { hatchifyReactRest } from "./services"

export type { HatchifyReactRest } from "./services"
export type { Schema } from "@hatchifyjs/rest-client"

export {
  useCreateOne,
  useDeleteOne,
  useAll,
  useOne,
  useUpdateOne,
} from "./services"

export default hatchifyReactRest
