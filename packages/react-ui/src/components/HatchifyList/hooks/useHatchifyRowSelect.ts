import { useState } from "react"

export default function useHatchifyListCheckboxes(
  onSelectionChange: (ids: string[]) => void,
): {
  selected: Record<string, true>
  setSelected: (ids: Record<string, true>) => void
} {
  const [selected, setSelected] = useState<Record<string, true>>({})

  const setSelectedWrapper = (ids: Record<string, true>) => {
    setSelected(ids)
    onSelectionChange(Object.keys(ids))
  }

  return {
    selected,
    setSelected: setSelectedWrapper,
  }
}
