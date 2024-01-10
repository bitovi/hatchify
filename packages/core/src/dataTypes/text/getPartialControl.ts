import type { PartialTextProps } from "./types.js"
import { getPartialControl as getStringPartialControl } from "../string/index.js"
import type { PartialStringControlType } from "../string/types.js"

export function getPartialControl<TRequired extends boolean>(
  props?: PartialTextProps<TRequired>,
): PartialStringControlType<TRequired> {
  return getStringPartialControl({
    ...props,
    min: 0,
    max: Infinity,
  })
}
