import type {
  HatchifyCollectionSort,
  HatchifyDisplay,
  SortObject,
} from "@hatchifyjs/react-ui"
import type { Meta } from "@hatchifyjs/rest-client"

export interface RenderHeaderProps {
  column: HatchifyDisplay
  direction: SortObject["direction"]
  meta: Meta
  setSort: HatchifyCollectionSort["setSort"]
  sortBy?: SortObject["sortBy"]
}
