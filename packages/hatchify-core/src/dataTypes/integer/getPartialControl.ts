import type { PartialNumberControlType, PartialNumberProps } from "../../types"
import { getPartialControl as getNumberPartialControl } from "../number/getPartialControl"

export function getPartialControl(
  props?: PartialNumberProps,
): PartialNumberControlType {
  return getNumberPartialControl({ ...props, step: 1 })
}
