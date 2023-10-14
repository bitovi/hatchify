import type { PartialIntegerProps } from "./types"
import { getPartialControl as getNumberPartialControl } from "../number"
import type { PartialNumberControlType } from "../number/types"

export function getPartialControl<TRequired extends boolean>(
  props?: PartialIntegerProps<TRequired>,
): PartialNumberControlType<TRequired> {
  return getNumberPartialControl({ ...props, step: 1 })
}
