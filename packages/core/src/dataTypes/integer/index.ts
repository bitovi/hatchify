import { getPartialControl } from "./getPartialControl"
import { getPartialOrm } from "./getPartialOrm"
import type { PartialAttribute } from "../../types"
import { getFinalize } from "../number"
import type {
  FinalNumberORM,
  PartialNumberControlType,
  PartialNumberORM,
  PartialNumberProps,
} from "../number"

export function integer<TRequired extends boolean = false>(
  props?: PartialNumberProps<TRequired>,
): PartialAttribute<
  PartialNumberORM,
  PartialNumberControlType<TRequired>,
  number,
  FinalNumberORM
> {
  return {
    name: `integer(${props ? JSON.stringify(props) : ""})`,
    orm: getPartialOrm(props),
    control: getPartialControl(props),
    finalize: function finalizeInteger() {
      return getFinalize(this)
    },
  }
}

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

type B1 = Prettify<PartialNumberControlType<false>>["allowNullInfer"]
//   ^?
type BB1 = Prettify<PartialNumberControlType<true>>["allowNullInfer"]
//   ^?
type B2 = Prettify<PartialNumberControlType<false>>["allowNull"]
//   ^?
type BB2 = Prettify<PartialNumberControlType<true>>["allowNull"]
//   ^?
const aaaa1 = integer({ required: true })
type A1 = Prettify<typeof aaaa1>["control"]["allowNullInfer"]
//   ^?
type AA1 = Prettify<typeof aaaa1>["control"]["allowNull"]
//   ^?
const aaaa2 = integer()
type A2 = Prettify<typeof aaaa2>["control"]["allowNullInfer"]
//   ^?
type AA2 = Prettify<typeof aaaa2>["control"]["allowNull"]
//   ^?
