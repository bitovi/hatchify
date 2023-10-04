import type { PartialIntegerProps } from "./types"
import { getPartialOrm as getNumberPartialOrm } from "../number"
import type { PartialNumberORM } from "../number"

export function getPartialOrm(props?: PartialIntegerProps): PartialNumberORM {
  const numberOrm = getNumberPartialOrm(props)

  return {
    ...numberOrm,
    sequelize: {
      ...numberOrm.sequelize,
      type: "INTEGER",
    },
  }
}
