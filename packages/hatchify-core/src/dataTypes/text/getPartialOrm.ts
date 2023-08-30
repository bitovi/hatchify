import type { PartialTextProps } from "./types"
import type { PartialStringORM } from "../string"
import { getPartialOrm as getStringPartialOrm } from "../string"

export function getPartialOrm(props?: PartialTextProps): PartialStringORM {
  const stringOrm = getStringPartialOrm({ ...props, min: 0, max: Infinity })

  return {
    ...stringOrm,
    sequelize: {
      ...stringOrm.sequelize,
      type: "TEXT",
    },
  }
}
