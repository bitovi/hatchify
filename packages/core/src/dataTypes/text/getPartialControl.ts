import type { PartialTextProps } from "./types"
import { getPartialControl as getStringPartialControl } from "../string"
import type { PartialStringControlType } from "../string/types"

export function getPartialControl(
  props?: PartialTextProps,
): PartialStringControlType {
  return getStringPartialControl({ ...props, min: 0, max: Infinity })
}
