import { coerce } from "./coerce.js"
import { finalizeControl } from "./finalizeControl.js"
import { finalizeOrm } from "./finalizeOrm.js"
import type {
  FinalBooleanORM,
  PartialBooleanControlType,
  PartialBooleanORM,
} from "./types.js"
import { HatchifyCoerceError } from "../../types/index.js"
import type {
  FinalAttribute,
  PartialAttribute,
  ValueInRequest,
} from "../../types/index.js"

export function getFinalize(
  props: PartialAttribute<
    PartialBooleanORM,
    Omit<PartialBooleanControlType<boolean>, "allowNullInfer">,
    boolean,
    FinalBooleanORM
  >,
): FinalAttribute<
  PartialBooleanORM,
  Omit<PartialBooleanControlType<boolean>, "allowNullInfer">,
  boolean,
  FinalBooleanORM
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
    setORMPropertyValue: (jsonValue: ValueInRequest): boolean | null => {
      return coerce(
        jsonValue === undefined && control.allowNull ? null : jsonValue,
        control,
      )
    },

    // Passed  - Any crazy STRING value the client might send as GET
    // Returns - A type the ORM can use
    // Throws  - If the data is bad ❓
    // Example : ?filter[age]=xyz ... xyz => throw "xyz is not a boolean";
    setORMQueryFilterValue: (queryValue: string): boolean | null => {
      if (["null", "undefined"].includes(queryValue)) {
        if (control.allowNull !== false) {
          return null
        }
        throw new HatchifyCoerceError("as a non-null value")
      }

      if (!["true", "false"].includes(queryValue)) {
        throw new HatchifyCoerceError("as a boolean")
      }

      return coerce(queryValue === "true", control)
    },

    // ===== RESPONSE =====
    // Passed  - A value from the ORM
    // Returns - A JSON value that can be serialized
    // Example : new Date() => '2023-07-17T01:45:28.778Z'
    serializeORMPropertyValue: (ormValue: boolean | null): boolean | null => {
      return coerce(ormValue, control)
    },
  }
}
