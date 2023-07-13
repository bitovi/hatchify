import { useState } from "react"

export default function useHatchifyListCheckboxes(): {
  selected: string[] | true
  setSelected: (ids: string[] | true) => void
} {
  const [selected, setSelected] = useState<string[] | true>([])

  return {
    selected,
    setSelected,
  }
}
