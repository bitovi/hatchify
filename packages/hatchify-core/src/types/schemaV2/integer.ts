import type { PartialNumberProps } from "./number"

export type PartialIntegerProps = Omit<PartialNumberProps, "step">
