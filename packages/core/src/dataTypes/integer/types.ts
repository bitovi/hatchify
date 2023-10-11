import type { PartialNumberProps } from "../number"

export type PartialIntegerProps<TRequired extends boolean> = Omit<
  PartialNumberProps<TRequired>,
  "step"
>
