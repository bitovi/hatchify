import { useState } from "react"
import type { HatchifyListFilter } from "../../../presentation"

export default function useHatchifyFilter(): HatchifyListFilter {
  const [filter, setFilter] = useState<{ [key: string]: string }>({})

  return { filter, setFilter }
}
