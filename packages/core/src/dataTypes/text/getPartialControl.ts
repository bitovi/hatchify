import type { PartialTextProps } from "./types"
import { getPartialControl as getStringPartialControl } from "../string"
import type { PartialStringControlType } from "../string/types"

export function getPartialControl<TRequired extends boolean>(
  props?: PartialTextProps<TRequired>,
): PartialStringControlType<TRequired> {
  return getStringPartialControl({ ...props, min: 0, max: Infinity })
}
