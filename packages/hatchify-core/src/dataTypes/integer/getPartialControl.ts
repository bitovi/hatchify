import type { PartialIntegerProps } from "./types"
import { getPartialControl as getNumberPartialControl } from "../number"
import type { PartialNumberControlType } from "../number/types"

export function getPartialControl(
  props?: PartialIntegerProps,
): PartialNumberControlType {
  return getNumberPartialControl({ ...props, step: 1 })
}
