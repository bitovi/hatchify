import { coerce } from "./coerce.js"
import { finalizeControl } from "./finalizeControl.js"
import { finalizeOrm } from "./finalizeOrm.js"
import { isISO8601DateString } from "./isISO8601DateString.js"
import type {
  FinalDateonlyORM,
  PartialDateonlyControlType,
  PartialDateonlyORM,
} from "./types.js"
import { HatchifyCoerceError } from "../../types/index.js"
import type {
  FinalAttribute,
  PartialAttribute,
  UserValue,
  ValueInRequest,
} from "../../types/index.js"

export function getFinalize(
  props: PartialAttribute<
    PartialDateonlyORM,
    Omit<PartialDateonlyControlType<boolean>, "allowNullInfer">,
    string,
    FinalDateonlyORM
  >,
): FinalAttribute<
  PartialDateonlyORM,
  Omit<PartialDateonlyControlType<boolean>, "allowNullInfer">,
  string,
  FinalDateonlyORM
> {
  const control = finalizeControl(props.control)

  return {
    name: props.name,
    control,
    orm: finalizeOrm(props.orm),

    // Passed  - a possible "client" version of the data type.
    //           - A value passed to createTodo()
    //           - The serialized value returned from the server
    // Returns - a valid "client" instance of the data type.
    // Throws  - if the possible value is not valid.  ❓
    // Example : "2023-09-05" => new Date("2023-09-05")
    //         : throw "'4 $core' is not a valid date";
    setClientPropertyValue: (userValue: UserValue): string | null => {
      if (typeof userValue === "string") {
        if (!isISO8601DateString(userValue)) {
          throw new HatchifyCoerceError("as a 'YYYY-MM-DD' string")
        }
      }

      return coerce(userValue, control)
    },

    // Passed  - a valid "client" version of the data type
    // Returns - Something that can be serialized to JSON
    // Example : new Date() => '2023-07-17T01:45:28.778Z'
    serializeClientPropertyValue: (value: string | null): string | null => {
      const coerced = coerce(value, control)

      return coerced === null ? null : coerced
    },

    // Passed  - Any crazy value the client might use to filter
    // Returns - A value react-rest can understand / use
    // Throws  - If the data is bad ❓
    // Example : ?filter[age]=xyz ... xyz => throw "xyz is not a number";
    setClientQueryFilterValue: (userValue: UserValue): string | null => {
      if (typeof userValue === "string") {
        if (!isISO8601DateString(userValue)) {
          throw new HatchifyCoerceError("as a 'YYYY-MM-DD' string")
        }
      }

      return coerce(userValue, control)
    },

    // Passed  - Any value someone might try to query by
    // Returns - A STRING value that can be sent as part of the query string.
    // Example : true => "true";
    serializeClientQueryFilterValue: (value: string | null): string => {
      const coerced = coerce(value, control)

      return coerced ? coerced : JSON.stringify(null)
    },

    // Passed  - Any crazy STRING value the client might send as GET
    // Returns - A type the client can use
    // Throws  - If the data is bad ❓. Also, what should the behavior be?
    // Example : '2023-07-17T01:45:28.778Z' => new Date('2023-07-17T01:45:28.778Z')
    setClientPropertyValueFromResponse: (
      jsonValue: ValueInRequest,
    ): string | null => {
      if (typeof jsonValue === "string") {
        if (!isISO8601DateString(jsonValue)) {
          throw new HatchifyCoerceError("as a 'YYYY-MM-DD' string")
        }
      }

      return coerce(jsonValue, control)
    },

    // Passed  - Any crazy value the client might send as a POST or PATCH
    // Returns - A type the ORM can use
    // Throws  - If the data is bad ❓
    // Example : '2023-07-17T01:45:28.778Z' => new Date('2023-07-17T01:45:28.778Z')
    //         : throw "'4 $core' is not a valid date";
    setORMPropertyValue: (jsonValue: ValueInRequest): string | null => {
      if (control.readOnly) {
        throw new HatchifyCoerceError("as a read-only value")
      }

      return coerce(
        jsonValue === undefined && control.allowNull ? null : jsonValue,
        control,
      )
    },

    // Passed  - Any crazy STRING value the client might send as GET
    // Returns - A type the ORM can use
    // Throws  - If the data is bad ❓
    // Example : ?filter[age]=xyz ... xyz => throw "xyz is not a dateonly";
    setORMQueryFilterValue: (queryValue: string): string | null => {
      if (["null", "undefined"].includes(queryValue)) {
        if (control.allowNull !== false) {
          return null
        }
        throw new HatchifyCoerceError("as a non-null value")
      }

      if (!isISO8601DateString(queryValue)) {
        throw new HatchifyCoerceError("as a 'YYYY-MM-DD' string")
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
