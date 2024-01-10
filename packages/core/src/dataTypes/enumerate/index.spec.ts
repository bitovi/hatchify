import { HatchifyCoerceError } from "../../types/index.js"

import { enumerate } from "./index.js"

describe("enumerate", () => {
  const values = ["valid", "valid2"]

  describe("enumerate({ values: ['valid', 'valid2']})", () => {
    const type = enumerate({ values })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'enumerate({"values":["valid","valid2"]})',
        orm: {
          sequelize: {
            type: "ENUM",
            typeArgs: values,
            allowNull: undefined,
            primaryKey: undefined,
          },
        },
        control: {
          type: "enum",
          allowNull: undefined,
          primary: undefined,
          values,
        },
        finalize: expect.any(Function),
      })
    })

    it("transforms correctly", () => {
      const {
        setClientPropertyValue,
        serializeClientPropertyValue,
        setClientQueryFilterValue,
        serializeClientQueryFilterValue,
        setClientPropertyValueFromResponse,
        serializeORMPropertyValue,
        setORMPropertyValue,
        setORMQueryFilterValue,
      } = type.finalize()

      // setClientPropertyValue
      expect(setClientPropertyValue?.("valid")).toBe("valid")
      expect(() => setClientPropertyValue?.(8)).toThrow(
        new HatchifyCoerceError("as a string"),
      )
      expect(setClientPropertyValue?.(null)).toBeNull()
      expect(() => setClientPropertyValue?.(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
      )
      expect(() => setClientPropertyValue?.("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )

      // serializeClientPropertyValue
      expect(serializeClientPropertyValue?.("valid")).toBe("valid")
      expect(serializeClientPropertyValue?.(null)).toBeNull()

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.("valid")).toBe("valid")
      expect(setClientQueryFilterValue?.(null)).toBeNull()
      expect(() => setClientQueryFilterValue?.(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
      )
      expect(() => setClientQueryFilterValue?.(7)).toThrow(
        new HatchifyCoerceError("as a string"),
      )
      expect(() => setClientQueryFilterValue?.("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )

      // serializeClientQueryFilterValue
      expect(serializeClientQueryFilterValue?.("valid")).toBe("valid")
      expect(serializeClientQueryFilterValue?.(null)).toBe("null")
      // This function expects valid data, so it won't throw an error.
      expect(serializeClientQueryFilterValue?.("invalid")).toBe("invalid")

      // setClientPropertyValueFromResponse
      expect(setClientPropertyValueFromResponse?.("valid")).toBe("valid")
      expect(setClientPropertyValueFromResponse?.(null)).toBeNull()
      expect(() => setClientPropertyValueFromResponse?.(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
      )
      expect(() => setClientPropertyValueFromResponse?.("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue("valid")).toBe("valid")
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() => serializeORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )
      expect(() => serializeORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue("valid")).toBe("valid")
      expect(setORMPropertyValue(null)).toBeNull()
      expect(setORMPropertyValue(undefined)).toBeNull()
      expect(() => setORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("valid")).toBe("valid")
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'enumerate({"values":["valid","valid2"]})',
        orm: {
          sequelize: {
            type: "ENUM",
            typeArgs: values,
            allowNull: true,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "enum",
          displayName: null,
          allowNull: true,
          primary: false,
          default: null,
          values,
        },
        setClientPropertyValue: expect.any(Function),
        serializeClientPropertyValue: expect.any(Function),
        setClientQueryFilterValue: expect.any(Function),
        serializeClientQueryFilterValue: expect.any(Function),
        setClientPropertyValueFromResponse: expect.any(Function),
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      })
    })
  })

  describe("enumerate({ values: ['valid', 'valid2'], required: true})", () => {
    const type = enumerate({ values, required: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'enumerate({"values":["valid","valid2"],"required":true})',
        orm: {
          sequelize: {
            type: "ENUM",
            typeArgs: values,
            allowNull: false,
            primaryKey: undefined,
          },
        },
        control: {
          type: "enum",
          allowNull: false,
          allowNullInfer: false,
          primary: undefined,
          values,
        },
        finalize: expect.any(Function),
      })
    })

    it("transforms correctly", () => {
      const {
        setClientPropertyValue,
        serializeClientPropertyValue,
        setClientQueryFilterValue,
        serializeClientQueryFilterValue,
        setClientPropertyValueFromResponse,
        serializeORMPropertyValue,
        setORMPropertyValue,
        setORMQueryFilterValue,
      } = type.finalize()

      // setClientPropertyValue
      expect(setClientPropertyValue?.("valid")).toBe("valid")
      expect(() => setClientPropertyValue?.(8)).toThrow(
        new HatchifyCoerceError("as a string"),
      )
      expect(() => setClientPropertyValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientPropertyValue?.(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
      )
      expect(() => setClientPropertyValue?.("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )

      // serializeClientPropertyValue
      expect(serializeClientPropertyValue?.("valid")).toBe("valid")
      expect(serializeClientPropertyValue?.(null)).toBeNull()

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.("valid")).toBe("valid")
      expect(() => setClientQueryFilterValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientQueryFilterValue?.(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
      )
      expect(() => setClientQueryFilterValue?.(7)).toThrow(
        new HatchifyCoerceError("as a string"),
      )
      expect(() => setClientQueryFilterValue?.("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )

      // serializeClientQueryFilterValue
      expect(serializeClientQueryFilterValue?.("valid")).toBe("valid")
      expect(serializeClientQueryFilterValue?.(null)).toBe("null")
      // This function expects valid data, so it won't throw an error.
      expect(serializeClientQueryFilterValue?.("invalid")).toBe("invalid")

      // setClientPropertyValueFromResponse
      expect(setClientPropertyValueFromResponse?.("valid")).toBe("valid")
      expect(() => setClientPropertyValueFromResponse?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientPropertyValueFromResponse?.(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
      )
      expect(() => setClientPropertyValueFromResponse?.("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue("valid")).toBe("valid")
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => serializeORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )
      expect(() => serializeORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue("valid")).toBe("valid")
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMPropertyValue(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
      )
      expect(() => setORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("valid")).toBe("valid")
      expect(() => setORMQueryFilterValue("null")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("undefined")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'enumerate({"values":["valid","valid2"],"required":true})',
        orm: {
          sequelize: {
            type: "ENUM",
            typeArgs: values,
            allowNull: false,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "enum",
          displayName: null,
          allowNull: false,
          primary: false,
          default: null,
          values,
        },
        setClientPropertyValue: expect.any(Function),
        serializeClientPropertyValue: expect.any(Function),
        setClientQueryFilterValue: expect.any(Function),
        serializeClientQueryFilterValue: expect.any(Function),
        setClientPropertyValueFromResponse: expect.any(Function),
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      })
    })
  })

  describe("enumerate({ values: ['valid', 'valid2'], primary: true})", () => {
    const type = enumerate({ values, primary: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'enumerate({"values":["valid","valid2"],"primary":true})',
        orm: {
          sequelize: {
            type: "ENUM",
            typeArgs: values,
            allowNull: undefined,
            primaryKey: true,
          },
        },
        control: {
          type: "enum",
          allowNull: undefined,
          primary: true,
          values,
        },
        finalize: expect.any(Function),
      })
    })

    it("transforms correctly", () => {
      const {
        setClientPropertyValue,
        serializeClientPropertyValue,
        setClientQueryFilterValue,
        serializeClientQueryFilterValue,
        setClientPropertyValueFromResponse,
        serializeORMPropertyValue,
        setORMPropertyValue,
        setORMQueryFilterValue,
      } = type.finalize()

      // setClientPropertyValue
      expect(setClientPropertyValue?.("valid")).toBe("valid")
      expect(() => setClientPropertyValue?.(8)).toThrow(
        new HatchifyCoerceError("as a string"),
      )
      expect(() => setClientPropertyValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientPropertyValue?.(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
      )
      expect(() => setClientPropertyValue?.("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )

      // serializeClientPropertyValue
      expect(serializeClientPropertyValue?.("valid")).toBe("valid")
      expect(serializeClientPropertyValue?.(null)).toBeNull()

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.("valid")).toBe("valid")
      expect(() => setClientQueryFilterValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientQueryFilterValue?.(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
      )
      expect(() => setClientQueryFilterValue?.(7)).toThrow(
        new HatchifyCoerceError("as a string"),
      )
      expect(() => setClientQueryFilterValue?.("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )

      // serializeClientQueryFilterValue
      expect(serializeClientQueryFilterValue?.("valid")).toBe("valid")
      expect(serializeClientQueryFilterValue?.(null)).toBe("null")
      // This function expects valid data, so it won't throw an error.
      expect(serializeClientQueryFilterValue?.("invalid")).toBe("invalid")

      // setClientPropertyValueFromResponse
      expect(setClientPropertyValueFromResponse?.("valid")).toBe("valid")
      expect(() => setClientPropertyValueFromResponse?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientPropertyValueFromResponse?.(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
      )
      expect(() => setClientPropertyValueFromResponse?.("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue("valid")).toBe("valid")
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => serializeORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )
      expect(() => serializeORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue("valid")).toBe("valid")
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMPropertyValue(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
      )
      expect(() => setORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("valid")).toBe("valid")
      expect(() => setORMQueryFilterValue("null")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("undefined")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'enumerate({"values":["valid","valid2"],"primary":true})',
        orm: {
          sequelize: {
            type: "ENUM",
            typeArgs: values,
            allowNull: false,
            primaryKey: true,
            unique: true,
            defaultValue: null,
          },
        },
        control: {
          type: "enum",
          displayName: null,
          allowNull: false,
          primary: true,
          default: null,
          values,
        },
        setClientPropertyValue: expect.any(Function),
        serializeClientPropertyValue: expect.any(Function),
        setClientQueryFilterValue: expect.any(Function),
        serializeClientQueryFilterValue: expect.any(Function),
        setClientPropertyValueFromResponse: expect.any(Function),
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      })
    })
  })
})
