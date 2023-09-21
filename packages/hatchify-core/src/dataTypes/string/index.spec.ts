import { HatchifyCoerceError } from "../../types"

import { string } from "."

describe("string", () => {
  describe("string()", () => {
    const type = string()

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: "string()",
        orm: {
          sequelize: {
            type: "STRING",
            typeArgs: [],
            allowNull: undefined,
            primaryKey: undefined,
          },
        },
        control: {
          type: "String",
          allowNull: undefined,
          min: undefined,
          max: undefined,
          primary: undefined,
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
        name: "string()",
        orm: {
          sequelize: {
            type: "STRING",
            typeArgs: [255],
            allowNull: true,
            primaryKey: false,
            defaultValue: null,
          },
        },
        control: {
          type: "String",
          allowNull: true,
          min: 0,
          max: 255,
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

  describe("string({required: true})", () => {
    const type = string({ required: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'string({"required":true})',
        orm: {
          sequelize: {
            type: "STRING",
            typeArgs: [],
            allowNull: false,
            primaryKey: undefined,
          },
        },
        control: {
          type: "String",
          allowNull: false,
          min: undefined,
          max: undefined,
          primary: undefined,
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
      expect(() => setClientQueryFilterValue?.(null)).toThrow(
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
        name: 'string({"required":true})',
        orm: {
          sequelize: {
            type: "STRING",
            typeArgs: [255],
            allowNull: false,
            primaryKey: false,
            defaultValue: null,
          },
        },
        control: {
          type: "String",
          allowNull: false,
          min: 0,
          max: 255,
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

  describe("string({primary: true})", () => {
    const type = string({ primary: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'string({"primary":true})',
        orm: {
          sequelize: {
            type: "STRING",
            typeArgs: [],
            allowNull: undefined,
            primaryKey: true,
          },
        },
        control: {
          type: "String",
          allowNull: undefined,
          min: undefined,
          max: undefined,
          primary: true,
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
      expect(() => setClientQueryFilterValue?.(null)).toThrow(
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
        name: 'string({"primary":true})',
        orm: {
          sequelize: {
            type: "STRING",
            typeArgs: [255],
            allowNull: false,
            primaryKey: true,
            defaultValue: null,
          },
        },
        control: {
          type: "String",
          allowNull: false,
          min: 0,
          max: 255,
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

  describe("string({min: 1, max: 10})", () => {
    const type = string({ min: 1, max: 10 })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'string({"min":1,"max":10})',
        orm: {
          sequelize: {
            type: "STRING",
            typeArgs: [10],
            allowNull: undefined,
            primaryKey: undefined,
          },
        },
        control: {
          type: "String",
          allowNull: undefined,
          min: 1,
          max: 10,
          primary: undefined,
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

      // serializeClientPropertyValue
      expect(serializeClientPropertyValue?.("name")).toBe("name")
      expect(serializeClientPropertyValue?.(null)).toBeNull()
      expect(() => setClientPropertyValue?.(7)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

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
      expect(() => serializeORMPropertyValue("")).toThrow(
        new HatchifyCoerceError("with length greater than or equal to 1"),
      )
      expect(() => serializeORMPropertyValue("a very long string")).toThrow(
        new HatchifyCoerceError("with length less than or equal to 10"),
      )
      expect(() => serializeORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue("valid")).toBe("valid")
      expect(setORMPropertyValue(null)).toBeNull()
      expect(setORMPropertyValue(undefined)).toBeNull()
      expect(() => setORMPropertyValue("")).toThrow(
        new HatchifyCoerceError("with length greater than or equal to 1"),
      )
      expect(() => setORMPropertyValue("a very long string")).toThrow(
        new HatchifyCoerceError("with length less than or equal to 10"),
      )
      expect(() => setORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("valid")).toBe("valid")
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("")).toThrow(
        new HatchifyCoerceError("with length greater than or equal to 1"),
      )
      expect(() => setORMQueryFilterValue("a very long string")).toThrow(
        new HatchifyCoerceError("with length less than or equal to 10"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'string({"min":1,"max":10})',
        orm: {
          sequelize: {
            type: "STRING",
            typeArgs: [10],
            allowNull: true,
            primaryKey: false,
            defaultValue: null,
          },
        },
        control: {
          type: "String",
          allowNull: true,
          min: 1,
          max: 10,
          primary: false,
          default: null,
          regex: /(.*?)/,
        },
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      })
    })
  })

  describe("string({regex: /^\\d+$/})", () => {
    const type = string({ regex: /^\d+$/ })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'string({"regex":"/^\\\\d+$/"})',
        orm: {
          sequelize: {
            type: "STRING",
            typeArgs: [],
            allowNull: undefined,
            primaryKey: undefined,
          },
        },
        control: {
          type: "String",
          allowNull: undefined,
          min: undefined,
          max: undefined,
          primary: undefined,
          regex: /^\d+$/,
        },
        finalize: expect.any(Function),
      })
    })

    it("transforms correctly", () => {
      const {
        serializeORMPropertyValue,
        setORMPropertyValue,
        setORMQueryFilterValue,
      } = type.finalize()

      // todo: HATCH-347

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue("123")).toBe("123")
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() => serializeORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("with format of /^\\d+$/"),
      )
      expect(() => serializeORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue("123")).toBe("123")
      expect(setORMPropertyValue(null)).toBeNull()
      expect(setORMPropertyValue(undefined)).toBeNull()
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("with format of /^\\d+$/"),
      )
      expect(() => setORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("123")).toBe("123")
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("with format of /^\\d+$/"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'string({"regex":"/^\\\\d+$/"})',
        orm: {
          sequelize: {
            type: "STRING",
            typeArgs: [255],
            allowNull: true,
            primaryKey: false,
            defaultValue: null,
          },
        },
        control: {
          type: "String",
          allowNull: true,
          min: 0,
          max: 255,
          primary: false,
          default: null,
          regex: /^\d+$/,
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
