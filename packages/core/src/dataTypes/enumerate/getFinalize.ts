import { coerce } from "./coerce"
import { finalizeControl } from "./finalizeControl"
import { finalizeOrm } from "./finalizeOrm"
import type {
  FinalEnumORM,
  PartialEnumControlType,
  PartialEnumORM,
} from "./types"
import { HatchifyCoerceError } from "../../types"
import type {
  FinalAttribute,
  PartialAttribute,
  UserValue,
  ValueInRequest,
} from "../../types"

export function getFinalize(
  props: PartialAttribute<
    PartialEnumORM,
    Omit<PartialEnumControlType, "allowNullInfer">,
    string,
    FinalEnumORM
  >,
): FinalAttribute<
  PartialEnumORM,
  Omit<PartialEnumControlType, "allowNullInfer">,
  string,
  FinalEnumORM
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
    // Example : "today" => new Date()
    //         : throw "'4 $core' is not a valid date";
    setClientPropertyValue: (userValue: UserValue) => {
      return coerce(userValue, control)
    },

    // Passed  - a valid "client" version of the data type
    // Returns - Something that can be serialized to JSON
    // Example : new Date() => '2023-07-17T01:45:28.778Z'
    serializeClientPropertyValue: (value: string | null): string | null => {
      return value
    },

    // Passed  - Any crazy value the client might use to filter
    // Returns - A value react-rest can understand / use
    // Throws  - If the data is bad ❓
    // Example : ?filter[age]=xyz ... xyz => throw "xyz is not a number";
    setClientQueryFilterValue(queryValue: UserValue) {
      return coerce(queryValue, control)
    },

    // Passed  - Any value someone might try to query by
    // Returns - A STRING value that can be sent as part of the query string.
    // Example : true => "true";
    serializeClientQueryFilterValue(value: string | null): string {
      return value ?? JSON.stringify(value)
    },

    // Passed  - Any crazy STRING value the client might send as GET
    // Returns - A type the client can use
    // Throws  - If the data is bad ❓. Also, what should the behavior be?
    // Example : '2023-07-17T01:45:28.778Z' => new Date('2023-07-17T01:45:28.778Z')
    setClientPropertyValueFromResponse(
      jsonValue: ValueInRequest,
    ): string | null {
      return coerce(jsonValue, control)
    },

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
        if (control.allowNull) {
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
