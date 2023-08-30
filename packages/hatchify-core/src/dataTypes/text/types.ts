import type { PartialStringProps } from "../string"

export type PartialTextProps = Omit<PartialStringProps, "min" | "max">
