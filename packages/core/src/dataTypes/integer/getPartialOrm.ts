import type { PartialIntegerProps } from "./types.js"
import { getPartialOrm as getNumberPartialOrm } from "../number/index.js"
import type { PartialNumberORM } from "../number/index.js"

export function getPartialOrm(
  props?: PartialIntegerProps<boolean>,
): PartialNumberORM {
  const numberOrm = getNumberPartialOrm(props)

  return {
    ...numberOrm,
    sequelize: {
      ...numberOrm.sequelize,
      type: "INTEGER",
    },
  }
}
