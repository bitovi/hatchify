import { hatchifyReact } from "./hatchifyReact/index.js"

export type {
  CreateType,
  FlatCreateType,
  FlatUpdateType,
  RecordType,
  UpdateType,
} from "@hatchifyjs/rest-client"

export type { HatchifyApp } from "./hatchifyReact/index.js"

export * from "./components/index.js"
export * from "./presentation/index.js"
export * from "./hooks/index.js"

export default hatchifyReact
