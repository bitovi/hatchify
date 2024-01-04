import { useState } from "react"
import type { HatchifyDataGridSelected } from "../presentation"

export default function useSelected(
  defaultSelected?: HatchifyDataGridSelected["selected"],
  onSelectedChange?: HatchifyDataGridSelected["setSelected"],
): HatchifyDataGridSelected {
  const [selected, setSelected] = useState<
    HatchifyDataGridSelected["selected"]
  >(defaultSelected || { all: false, ids: [] })

  const setSelectedWrapper: HatchifyDataGridSelected["setSelected"] = (
    selected,
  ) => {
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
