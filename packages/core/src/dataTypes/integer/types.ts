import type { PartialNumberProps } from "../number/index.js"

export type PartialIntegerProps<TRequired extends boolean> = Omit<
  PartialNumberProps<TRequired>,
  "step"
>
