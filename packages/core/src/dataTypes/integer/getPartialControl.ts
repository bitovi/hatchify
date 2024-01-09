import type { PartialIntegerProps } from "./types.js"
import { getPartialControl as getNumberPartialControl } from "../number/index.js"
import type { PartialNumberControlType } from "../number/types.js"

export function getPartialControl<TRequired extends boolean>(
  props?: PartialIntegerProps<TRequired>,
): PartialNumberControlType<TRequired> {
  return getNumberPartialControl({ ...props, step: 1 })
}
