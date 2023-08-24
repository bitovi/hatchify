import { getPartialControl as getNumberPartialControl } from "../number"
import type {
  PartialNumberControlType,
  PartialNumberProps,
} from "../number/types"

export function getPartialControl(
  props?: PartialNumberProps,
): PartialNumberControlType {
  return getNumberPartialControl({ ...props, step: 1 })
}
