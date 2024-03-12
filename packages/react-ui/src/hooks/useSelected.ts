import { useState } from "react"
import type {
  HatchifyDataGridSelected,
  HatchifyDataGridSelectedState,
} from "../presentation/index.js"

export default function useSelected(
  defaultSelected?: HatchifyDataGridSelectedState,
  onSelectedChange?: (selected: HatchifyDataGridSelectedState) => void,
): HatchifyDataGridSelected {
  const [selected, setSelected] = useState<HatchifyDataGridSelectedState>(
    defaultSelected || { all: false, ids: [] },
  )

  const setSelectedWrapper: (
    selected: HatchifyDataGridSelectedState,
  ) => void = (selected) => {
    setSelected(selected)
    if (onSelectedChange) {
      onSelectedChange(selected)
    }
  }

  return {
    selected,
    setSelected: setSelectedWrapper,
  }
}
