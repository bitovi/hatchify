import { coerce } from "./coerce"
import { finalizeControl } from "./finalizeControl"
import { finalizeOrm } from "./finalizeOrm"
import type {
  FinalAttribute,
  FinalNumberORM,
  PartialAttribute,
  PartialNumberControlType,
  PartialNumberORM,
  ValueInRequest,
} from "../../types"

export function getFinalize(
  props: PartialAttribute<
    PartialNumberORM,
    PartialNumberControlType,
    number,
    FinalNumberORM
  >,
): FinalAttribute<
  PartialNumberORM,
  PartialNumberControlType,
  number,
  FinalNumberORM
> {
  const control = finalizeControl(props.control)

  return {
    name: props.name,
    control,
    orm: finalizeOrm(props.orm),

    // Passed  - Any crazy value the client might send as a POST or PATCH
    // Returns - A type the ORM can use
    // Throws  - If the data is bad ❓
    // Example : '2023-07-17T01:45:28.778Z' => new Date('2023-07-17T01:45:28.778Z')
    //         : throw "'4 $core' is not a valid date";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setORMPropertyValue: (jsonValue: ValueInRequest): number | null => {
      return coerce(jsonValue, control)
    },

    // Passed  - Any crazy STRING value the client might send as GET
    // Returns - A type the ORM can use
    // Throws  - If the data is bad ❓
    // Example : ?filter[age]=xyz ... xyz => throw "xyz is not a number";
    setORMQueryFilterValue: (queryValue: string): number | null => {
      if (["null", "undefined"].includes(queryValue)) {
        if (control.allowNull !== false) {
          return null
        }
        throw new Error("Non-null value is required")
      }

      if (isNaN(+queryValue)) {
        throw new Error("Provided value is not a number")
      }

      return coerce(+queryValue, control)
    },

    // ===== RESPONSE =====
    // Passed  - A value from the ORM
    // Returns - A JSON value that can be serialized
    // Example : new Date() => '2023-07-17T01:45:28.778Z'
    serializeORMPropertyValue: (ormValue: number | null): number | null => {
      return coerce(ormValue, control)
    },
  }
}
