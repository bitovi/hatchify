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
    // @ts-expect-error
    finalize: function finalizeInteger() {
      return getFinalize(this)
    },
  }
}

// type B = Prettify<PartialNumberControlType<true>>["allowNullInfer"]
// //   ^?
// // declare function int<TRequired extends boolean, TPrimary extends boolean>(config: {
// //   primary?: TPrimary
// //   required?: TPrimary extends true ? true : TRequired
// // })
// // const aaa = int({ primary: true, required: false })
// type Prettify<T> = {
//   [K in keyof T]: T[K]
// } & {}

// const aaaa = integer({ required: true })
// type A = Prettify<typeof aaaa>["control"]["allowNullInfer"]
// //   ^?

// //    ^?
// // aaaa.control.allowNull.
