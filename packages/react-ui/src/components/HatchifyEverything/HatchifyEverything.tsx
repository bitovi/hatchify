import type {
  Filters,
  PaginationObject,
  FinalSchemas,
} from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
import type { HatchifyReactRest } from "@hatchifyjs/react-rest"
import type {
  HatchifyDataGridSelected,
  SortObject,
} from "../../presentation/index.js"
import { WithSchemas, NoSchemas } from "./components/index.js"

export interface HatchifyEverythingProps<
  TSchemas extends Record<string, PartialSchema>,
> {
  finalSchemas: FinalSchemas
  partialSchemas: TSchemas
  restClient: HatchifyReactRest<TSchemas>
  children?: React.ReactNode | null
  defaultSelected?: HatchifyDataGridSelectedState
  onSelectedChange?: (selected: HatchifyDataGridSelectedState) => void
  defaultPage?: PaginationObject
  defaultSort?: SortObject
  baseFilter?: Filters
  minimumLoadTime?: number
}

function HatchifyEverything<
  const TSchemas extends Record<string, PartialSchema>,
>({ finalSchemas, ...rest }: HatchifyEverythingProps<TSchemas>): JSX.Element {
  return (
    <>
      {Object.keys(finalSchemas).length !== 0 ? (
        <WithSchemas {...rest} finalSchemas={finalSchemas} />
      ) : (
        <NoSchemas />
      )}
    </>
  )
}

HatchifyEverything.displayName = "Everything"

export default HatchifyEverything
