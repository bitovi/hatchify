import type {
  HatchifyCollectionSort,
  HatchifyColumn,
  SortObject,
} from "@hatchifyjs/react-ui"
import type { Meta } from "@hatchifyjs/rest-client"

export interface RenderHeaderProps {
  column: Omit<
    HatchifyColumn,
    "isHeaderOverridden" | "renderData" | "renderHeader"
  >
  direction: SortObject["direction"]
  meta: Meta
  setSort: HatchifyCollectionSort["setSort"]
  sortBy?: SortObject["sortBy"]
}
