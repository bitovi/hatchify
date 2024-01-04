import type {
  Filters,
  PaginationObject,
  FinalSchemas,
} from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
import type { HatchifyReactRest } from "@hatchifyjs/react-rest"
import type { HatchifyDataGridSelected, SortObject } from "../../presentation"
import { WithSchemas, NoSchemas } from "./components"

export interface HatchifyEverythingProps<
  TSchemas extends Record<string, PartialSchema>,
> {
  finalSchemas: FinalSchemas
  partialSchemas: TSchemas
  restClient: HatchifyReactRest<TSchemas>
  children?: React.ReactNode | null
  defaultSelected?: HatchifyDataGridSelected["selected"]
  onSelectedChange?: HatchifyDataGridSelected["setSelected"]
  defaultPage?: PaginationObject
  defaultSort?: SortObject
  baseFilter?: Filters
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
