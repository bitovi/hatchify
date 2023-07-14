import { useState } from "react"

export default function useHatchifyListCheckboxes(): {
  selected: Record<string, true> | true
  setSelected: (ids: Record<string, true> | true) => void
} {
  const [selected, setSelected] = useState<Record<string, true> | true>({})

  return {
    selected,
    setSelected,
  }
}
