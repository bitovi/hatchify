import { HatchifyCoerceError } from "../../types/index.js"

import { text } from "./index.js"

describe("text", () => {
  describe("text()", () => {
    const type = text()

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: "text()",
        orm: {
          sequelize: {
            type: "TEXT",
            allowNull: undefined,
            primaryKey: undefined,
          },
        },
        control: {
          type: "String",
          allowNull: undefined,
          min: 0,
          max: Infinity,
          primary: undefined,
          regex: undefined,
          ui: {},
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
      expect(setClientPropertyValue?.("name")).toBe("name")
      expect(setClientPropertyValue?.(null)).toBeNull()
      expect(() => setClientPropertyValue?.(7)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // serializeClientPropertyValue
      expect(serializeClientPropertyValue?.("name")).toBe("name")
      expect(serializeClientPropertyValue?.(null)).toBeNull()

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.("name")).toBe("name")
      expect(setClientQueryFilterValue?.(null)).toBeNull()
      expect(() => setClientQueryFilterValue?.(7)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // serializeClientQueryFilterValue
      expect(serializeClientQueryFilterValue?.("name")).toBe("name")
      expect(serializeClientQueryFilterValue?.(null)).toBe("null")

      // setClientPropertyValueFromResponse
      expect(setClientPropertyValueFromResponse?.("name")).toBe("name")
      expect(setClientPropertyValueFromResponse?.(null)).toBeNull()

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue("valid")).toBe("valid")
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() => serializeORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue("valid")).toBe("valid")
      expect(setORMPropertyValue(null)).toBeNull()
      expect(setORMPropertyValue(undefined)).toBeNull()
      expect(() => setORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("valid")).toBe("valid")
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: "text()",
        orm: {
          sequelize: {
            type: "TEXT",
            allowNull: true,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "String",
          ui: {
            displayName: null,
            maxDisplayLength: null,
            hidden: false,
            maxRenderLength: null,
            enableCaseSensitiveContains: false,
          },
          allowNull: true,
          min: 0,
          max: Infinity,
          primary: false,
          default: null,
          regex: /(.*?)/,
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

  describe("text({required: true})", () => {
    const type = text({ required: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'text({"required":true})',
        orm: {
          sequelize: {
            type: "TEXT",
            allowNull: false,
            primaryKey: undefined,
          },
        },
        control: {
          type: "String",
          ui: {},
          allowNull: false,
          allowNullInfer: false,
          min: 0,
          max: Infinity,
          primary: undefined,
          regex: undefined,
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
      expect(setClientPropertyValue?.("name")).toBe("name")
      expect(() => setClientPropertyValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientPropertyValue?.(7)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // serializeClientPropertyValue
      expect(serializeClientPropertyValue?.("name")).toBe("name")
      expect(serializeClientPropertyValue?.(null)).toBeNull()

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.("name")).toBe("name")
      expect(() => setClientQueryFilterValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientQueryFilterValue?.(7)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // serializeClientQueryFilterValue
      expect(serializeClientQueryFilterValue?.("name")).toBe("name")
      expect(serializeClientQueryFilterValue?.(null)).toBe("null")

      // setClientPropertyValueFromResponse
      expect(setClientPropertyValueFromResponse?.("name")).toBe("name")
      expect(() => setClientPropertyValueFromResponse?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue("valid")).toBe("valid")
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => serializeORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
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

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("valid")).toBe("valid")
      expect(() => setORMQueryFilterValue("null")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("undefined")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'text({"required":true})',
        orm: {
          sequelize: {
            type: "TEXT",
            allowNull: false,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "String",
          ui: {
            displayName: null,
            maxDisplayLength: null,
            hidden: false,
            maxRenderLength: null,
            enableCaseSensitiveContains: false,
          },
          allowNull: false,
          min: 0,
          max: Infinity,
          primary: false,
          default: null,
          regex: /(.*?)/,
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

  describe("text({primary: true})", () => {
    const type = text({ primary: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'text({"primary":true})',
        orm: {
          sequelize: {
            type: "TEXT",
            allowNull: undefined,
            primaryKey: true,
          },
        },
        control: {
          type: "String",
          allowNull: undefined,
          min: 0,
          max: Infinity,
          primary: true,
          regex: undefined,
          ui: {},
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
      expect(setClientPropertyValue?.("name")).toBe("name")
      expect(() => setClientPropertyValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientPropertyValue?.(7)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // serializeClientPropertyValue
      expect(serializeClientPropertyValue?.("name")).toBe("name")
      expect(serializeClientPropertyValue?.(null)).toBeNull()

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.("name")).toBe("name")
      expect(() => setClientQueryFilterValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientQueryFilterValue?.(7)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // serializeClientQueryFilterValue
      expect(serializeClientQueryFilterValue?.("name")).toBe("name")
      expect(serializeClientQueryFilterValue?.(null)).toBe("null")

      // setClientPropertyValueFromResponse
      expect(setClientPropertyValueFromResponse?.("name")).toBe("name")
      expect(() => setClientPropertyValueFromResponse?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue("valid")).toBe("valid")
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => serializeORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
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

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("valid")).toBe("valid")
      expect(() => setORMQueryFilterValue("null")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("undefined")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'text({"primary":true})',
        orm: {
          sequelize: {
            type: "TEXT",
            allowNull: false,
            primaryKey: true,
            unique: true,
            defaultValue: null,
          },
        },
        control: {
          type: "String",
          ui: {
            displayName: null,
            maxDisplayLength: null,
            hidden: null,
            maxRenderLength: null,
            enableCaseSensitiveContains: false,
          },
          allowNull: false,
          min: 0,
          max: Infinity,
          primary: true,
          default: null,
          regex: /(.*?)/,
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
