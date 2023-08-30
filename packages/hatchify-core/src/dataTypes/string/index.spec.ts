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
        serializeORMPropertyValue,
        setORMPropertyValue,
        setORMQueryFilterValue,
      } = type.finalize()

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue("valid")).toBe("valid")
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() => serializeORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue("valid")).toBe("valid")
      expect(setORMPropertyValue(null)).toBeNull()
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
          },
        },
        control: {
          type: "String",
          allowNull: true,
          min: 0,
          max: 255,
          primary: false,
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
        serializeORMPropertyValue,
        setORMPropertyValue,
        setORMQueryFilterValue,
      } = type.finalize()

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
          },
        },
        control: {
          type: "String",
          allowNull: false,
          min: 0,
          max: 255,
          primary: false,
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
        serializeORMPropertyValue,
        setORMPropertyValue,
        setORMQueryFilterValue,
      } = type.finalize()

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
          },
        },
        control: {
          type: "String",
          allowNull: false,
          min: 0,
          max: 255,
          primary: true,
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
        serializeORMPropertyValue,
        setORMPropertyValue,
        setORMQueryFilterValue,
        setClientPropertyValue,
        serializeClientPropertyValue,
        setClientQueryFilterValue,
        serializeClientQueryFilterValue,
        setClientPropertyValueFromResponse,
      } = type.finalize()

      // todo: HATCH-347
      expect(setClientPropertyValue(null)).toEqual(null)
      expect(serializeClientPropertyValue(null)).toEqual(null)
      expect(setClientQueryFilterValue(null)).toEqual(null)
      expect(serializeClientQueryFilterValue(null)).toEqual("")
      expect(setClientPropertyValueFromResponse(null)).toEqual(null)

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
          },
        },
        control: {
          type: "String",
          allowNull: true,
          min: 1,
          max: 10,
          primary: false,
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
