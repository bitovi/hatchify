import { coerce } from "./coerce"
import { finalizeControl } from "./finalizeControl"
import { finalizeOrm } from "./finalizeOrm"
import type {
  FinalStringORM,
  PartialStringControlType,
  PartialStringORM,
} from "./types"
import { HatchifyCoerceError } from "../../types"
import type {
  FinalAttribute,
  PartialAttribute,
  ValueInRequest,
} from "../../types"

export function getFinalize(
  props: PartialAttribute<
    PartialStringORM,
    PartialStringControlType,
    string,
    FinalStringORM
  >,
): FinalAttribute<
  PartialStringORM,
  PartialStringControlType,
  string,
  FinalStringORM
> {
  const control = finalizeControl(props.control)

  return {
    name: props.name,
    control,
    orm: finalizeOrm(props.orm),

    // todo: HATCH-347

    // Passed  - Any crazy value the client might send as a POST or PATCH
    // Returns - A type the ORM can use
    // Throws  - If the data is bad ❓
    // Example : '2023-07-17T01:45:28.778Z' => new Date('2023-07-17T01:45:28.778Z')
    //         : throw "'4 $core' is not a valid date";
    setORMPropertyValue: (jsonValue: ValueInRequest): string | null => {
      return coerce(
        jsonValue === undefined && control.allowNull ? null : jsonValue,
        control,
      )
    },

    // Passed  - Any crazy STRING value the client might send as GET
    // Returns - A type the ORM can use
    // Throws  - If the data is bad ❓
    // Example : ?filter[age]=xyz ... xyz => throw "xyz is not a string";
    setORMQueryFilterValue: (queryValue: string): string | null => {
      if (["null", "undefined"].includes(queryValue)) {
        if (control.allowNull !== false) {
          return null
        }
        throw new HatchifyCoerceError("as a non-null value")
      }

      return coerce(queryValue, control)
    },

    // ===== RESPONSE =====
    // Passed  - A value from the ORM
    // Returns - A JSON value that can be serialized
    // Example : new Date() => '2023-07-17T01:45:28.778Z'
    serializeORMPropertyValue: (ormValue: string | null): string | null => {
      return coerce(ormValue, control)
    },
  }
}
