import type {
  ControlType,
  HatchifyNumberProps,
  PartialAttribute,
} from "../types"

export function number(props?: HatchifyNumberProps): PartialAttribute<number> {
  const allowNull = props?.required != null ? !props.required : props?.required
  const control: ControlType = {
    type: "Number",
    allowNull,
    min: props?.min,
    max: props?.max,
    primary: props?.primary,
    step: props?.step,
  }

  return {
    name: `number(${props ? JSON.stringify(props) : ""})`,
    orm: {
      sequelize: {
        type: "DOUBLE",
        typeArgs: [],
        allowNull,
        autoIncrement: props?.autoIncrement,
        primaryKey: props?.primary,
        ...buildValidation(props?.min, props?.max),
      },
    },
    control,
    // Passed  - Any crazy value the client might send as a POST or PATCH
    // Returns - A type the ORM can use
    // Throws  - If the data is bad ❓
    // Example : '2023-07-17T01:45:28.778Z' => new Date('2023-07-17T01:45:28.778Z')
    //         : throw "'4 $core' is not a valid date";
    setORMPropertyValue: (jsonValue: number | null): number | null => {
      return clientMutationCoerce(jsonValue, control)
    },

    // Passed  - Any crazy STRING value the client might send as GET
    // Returns - A type the ORM can use
    // Throws  - If the data is bad ❓
    // Example : ?filter[age]=xyz ... xyz => throw "xyz is not a number";
    setORMQueryFilterValue: (queryValue: string): number | null => {
      if (["null", "undefined"].includes(queryValue)) {
        if (control.allowNull !== false) return null
        throw new Error("Non-null value is required")
      }

      if (isNaN(+queryValue)) {
        throw new Error("Provided value is not a number")
      }

      return clientMutationCoerce(+queryValue, control)
    },

    // ===== RESPONSE =====
    // Passed  - A value from the ORM
    // Returns - A JSON value that can be serialized
    // Example : new Date() => '2023-07-17T01:45:28.778Z'
    serializeORMPropertyValue: (ormValue: number | null): number | null => {
      return clientMutationCoerce(ormValue, control)
    },

    finalize: (isId?: boolean): PartialAttribute<number> => {
      return number({
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

export function validateStep(
  value: number,
  step?: number,
  min?: number,
): boolean {
  if (value == null) return false
  if (!step) return true

  const diff = (value - (min || 0)) % step
  const epsilon = 0.00001 // a small tolerance
  const absDiff = diff < 0 ? -diff : diff
  return absDiff < epsilon || step - absDiff < epsilon
}

function buildValidation(min?: number, max?: number) {
  const validate = {
    ...([null, undefined, -Infinity].includes(min) ? {} : { min }),
    ...([null, undefined, Infinity].includes(max) ? {} : { max }),
  }

  return Object.keys(validate).length ? { validate } : {}
}

function clientMutationCoerce(
  value: number | null,
  control: ControlType,
): number | null {
  if (value == null) {
    if (control.allowNull !== false) return value
    throw new Error("Non-null value is required")
  }

  if (typeof value !== "number") {
    throw new Error("Provided value is not a number")
  }

  if ([-Infinity, Infinity].includes(value)) {
    throw new Error("Infinity as a value is not supported")
  }

  if (control.min != null && value < control.min) {
    throw new Error(
      `Provided value is lower than the minimum of ${control.min}`,
    )
  }

  if (control.max != null && value > control.max) {
    throw new Error(
      `Provided value is higher than the maximum of ${control.max}`,
    )
  }

  if (!validateStep(value, control.step, control.min)) {
    throw new Error(`Provided value violates the step of ${control.step}`)
  }

  return value
}
