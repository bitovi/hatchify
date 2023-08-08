import { number } from "./number"
import type { HatchifyIntegerProps, PartialAttribute } from "../types"

export function integer(
  props?: HatchifyIntegerProps,
): PartialAttribute<number> {
  const base = number({ ...props, step: 1 })

  return {
    ...base,
    name: `integer(${props ? JSON.stringify(props) : ""})`,
    orm: { ...base.orm, sequelize: { ...base.orm.sequelize, type: "INTEGER" } },
    control: { ...base.control, step: 1 },

    finalize: (isId?: boolean): PartialAttribute<number> => {
      return integer({
        ...props,
        autoIncrement: !!props?.autoIncrement,
        min: props?.min ?? (props?.autoIncrement ? 1 : -Infinity),
        max: props?.max ?? Infinity,
        primary: isId || !!props?.primary,
        required: isId || !!props?.primary || !!props?.required,
      })
    },
  }
}
