import { useState } from "react"
import type { HatchifyCollectionSelected } from "../presentation"

export default function useSelected(
  defaultSelected?: HatchifyCollectionSelected["selected"],
  onSelectedChange?: HatchifyCollectionSelected["setSelected"],
): HatchifyCollectionSelected {
  const [selected, setSelected] = useState<
    HatchifyCollectionSelected["selected"]
  >(defaultSelected || { all: false, ids: [] })

  const setSelectedWrapper: HatchifyCollectionSelected["setSelected"] = (
    selected,
  ) => {
    setSelected(selected)
    if (onSelectedChange) onSelectedChange(selected)
  }

  return {
    selected,
    setSelected: setSelectedWrapper,
  }
}
