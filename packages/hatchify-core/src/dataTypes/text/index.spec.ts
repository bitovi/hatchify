import { HatchifyCoerceError } from "../../types"

import { text } from "."

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
        name: "text()",
        orm: {
          sequelize: {
            type: "TEXT",
            allowNull: true,
            primaryKey: false,
          },
        },
        control: {
          type: "String",
          allowNull: true,
          min: 0,
          max: Infinity,
          primary: false,
        },
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
          allowNull: false,
          min: 0,
          max: Infinity,
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
        name: 'text({"required":true})',
        orm: {
          sequelize: {
            type: "TEXT",
            allowNull: false,
            primaryKey: false,
          },
        },
        control: {
          type: "String",
          allowNull: false,
          min: 0,
          max: Infinity,
          primary: false,
        },
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
        name: 'text({"primary":true})',
        orm: {
          sequelize: {
            type: "TEXT",
            allowNull: false,
            primaryKey: true,
          },
        },
        control: {
          type: "String",
          allowNull: false,
          min: 0,
          max: Infinity,
          primary: true,
        },
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      })
    })
  })
})
