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

// type Prettify<T> = {
//   [K in keyof T]: T[K]
// } & {}

// type B1 = Prettify<PartialNumberControlType<true>>["allowNullInfer"]
// //   ^?
// type B2 = Prettify<PartialNumberControlType<true>>["allowNull"]
// //   ^?
// const aaaa = integer({ required: false })
// type A1 = Prettify<typeof aaaa>["control"]["allowNullInfer"]
// //   ^?
// type A2 = Prettify<typeof aaaa>["control"]["allowNull"]
// //   ^?

// // declare function int<TRequired extends boolean, TPrimary extends boolean>(config: {
// //   primary?: TPrimary
// //   required?: TPrimary extends true ? true : TRequired
// // })
// // const aaa = int({ primary: true, required: false })
