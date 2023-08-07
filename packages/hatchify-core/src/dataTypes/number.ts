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
        ...(props?.min || props?.max
          ? {
              validate: {
                min: props?.min,
                max: props?.max,
              },
            }
          : {}),
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

      if (isNaN(queryValue as unknown as number)) {
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
  }
}

export function validateStep(value: number, step: number, min = 0): boolean {
  if (value == null) return false

  let absValue = Math.abs(value)
  let absStep = Math.abs(step)
  let absMin = Math.abs(min)

  while (
    (absValue > 0 && absValue < 1) ||
    (absStep > 0 && absStep < 1) ||
    (absMin > 0 && absMin < 1)
  ) {
    value *= 10
    step *= 10
    min *= 10

    absValue = Math.abs(value)
    absStep = Math.abs(step)
    absMin = Math.abs(min)
  }

  return (value - min) % step === 0
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

  if (control.step && !validateStep(value, control.step)) {
    throw new Error(`Provided value violates the step of ${control.step}`)
  }

  return value
}
