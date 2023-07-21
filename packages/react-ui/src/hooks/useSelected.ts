import { useState } from "react"

export default function useSelected(
  selectedDefault?: string[],
  onSelectedChange?: (ids: string[]) => void,
): {
  selected: string[]
  setSelected: (ids: string[]) => void
} {
  const [selected, setSelected] = useState<string[]>(selectedDefault || [])

  const setSelectedWrapper = (ids: string[]) => {
    setSelected(ids)
    if (onSelectedChange) onSelectedChange(ids)
  }

  return {
    selected,
    setSelected: setSelectedWrapper,
  }
}
