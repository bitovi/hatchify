import type { PartialNumberORM, PartialNumberProps } from "../../types"
import { getPartialOrm as getNumberPartialOrm } from "../number/getPartialOrm"

export function getPartialOrm(props?: PartialNumberProps): PartialNumberORM {
  const numberOrm = getNumberPartialOrm(props)

  return {
    ...numberOrm,
    sequelize: {
      ...numberOrm.sequelize,
      type: "INTEGER",
    },
  }
}
