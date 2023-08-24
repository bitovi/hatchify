import { HatchifyCoerceError } from "../../types"

import { integer } from "."

describe("integer", () => {
  describe("integer()", () => {
    const type = integer()

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: "integer()",
        orm: {
          sequelize: {
            type: "INTEGER",
            typeArgs: [],
            allowNull: undefined,
            autoIncrement: undefined,
            primaryKey: undefined,
          },
        },
        control: {
          type: "Number",
          allowNull: undefined,
          min: undefined,
          max: undefined,
          primary: undefined,
          step: 1,
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
      expect(serializeORMPropertyValue(-1)).toBe(-1)
      expect(serializeORMPropertyValue(0)).toBe(0)
      expect(serializeORMPropertyValue(1)).toBe(1)
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))
      expect(() => serializeORMPropertyValue(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue(-1)).toBe(-1)
      expect(setORMPropertyValue(0)).toBe(0)
      expect(setORMPropertyValue(1)).toBe(1)

      expect(setORMPropertyValue(null)).toBeNull()
      expect(() => setORMPropertyValue("invalid" as unknown as number)).toThrow(
        new HatchifyCoerceError("as a number"),
      )
      expect(() => setORMPropertyValue(-Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setORMPropertyValue(Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setORMPropertyValue(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("-1")).toBe(-1)
      expect(setORMQueryFilterValue("0")).toBe(0)
      expect(setORMQueryFilterValue("1")).toBe(1)
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as a number"),
      )
      expect(() => setORMQueryFilterValue("-Infinity")).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setORMQueryFilterValue("Infinity")).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setORMQueryFilterValue("1.1")).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: "integer()",
        orm: {
          sequelize: {
            type: "INTEGER",
            typeArgs: [],
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
          },
        },
        control: {
          type: "Number",
          allowNull: true,
          min: -Infinity,
          max: Infinity,
          primary: false,
          step: 1,
        },
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      })
    })
  })

  describe("integer({required: true})", () => {
    const type = integer({ required: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'integer({"required":true})',
        orm: {
          sequelize: {
            type: "INTEGER",
            typeArgs: [],
            allowNull: false,
            autoIncrement: undefined,
            primaryKey: undefined,
          },
        },
        control: {
          type: "Number",
          allowNull: false,
          min: undefined,
          max: undefined,
          primary: undefined,
          step: 1,
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
      expect(serializeORMPropertyValue(-1)).toBe(-1)
      expect(serializeORMPropertyValue(0)).toBe(0)
      expect(serializeORMPropertyValue(1)).toBe(1)
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))
      expect(() => serializeORMPropertyValue(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue(-1)).toBe(-1)
      expect(setORMPropertyValue(0)).toBe(0)
      expect(setORMPropertyValue(1)).toBe(1)
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMPropertyValue("invalid" as unknown as number)).toThrow(
        new HatchifyCoerceError("as a number"),
      )
      expect(() => setORMPropertyValue(-Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setORMPropertyValue(Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setORMPropertyValue(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("-1")).toBe(-1)
      expect(setORMQueryFilterValue("0")).toBe(0)
      expect(setORMQueryFilterValue("1")).toBe(1)
      expect(() => setORMQueryFilterValue("null")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("undefined")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as a number"),
      )
      expect(() => setORMQueryFilterValue("-Infinity")).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setORMQueryFilterValue("Infinity")).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setORMQueryFilterValue("1.1")).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'integer({"required":true})',
        orm: {
          sequelize: {
            type: "INTEGER",
            typeArgs: [],
            allowNull: false,
            autoIncrement: false,
            primaryKey: false,
          },
        },
        control: {
          type: "Number",
          allowNull: false,
          min: -Infinity,
          max: Infinity,
          primary: false,
          step: 1,
        },
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      })
    })
  })

  describe("integer({autoIncrement: true})", () => {
    const type = integer({ autoIncrement: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'integer({"autoIncrement":true})',
        orm: {
          sequelize: {
            type: "INTEGER",
            typeArgs: [],
            allowNull: undefined,
            autoIncrement: true,
            primaryKey: undefined,
          },
        },
        control: {
          type: "Number",
          allowNull: undefined,
          min: undefined,
          max: undefined,
          primary: undefined,
          step: 1,
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
      expect(serializeORMPropertyValue(-1)).toBe(-1)
      expect(serializeORMPropertyValue(0)).toBe(0)
      expect(serializeORMPropertyValue(1)).toBe(1)
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))
      expect(() => serializeORMPropertyValue(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue(-1)).toBe(-1)
      expect(setORMPropertyValue(0)).toBe(0)
      expect(setORMPropertyValue(1)).toBe(1)
      expect(setORMPropertyValue(null)).toBeNull()
      expect(() => setORMPropertyValue("invalid" as unknown as number)).toThrow(
        new HatchifyCoerceError("as a number"),
      )
      expect(() => setORMPropertyValue(-Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setORMPropertyValue(Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setORMPropertyValue(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("-1")).toBe(-1)
      expect(setORMQueryFilterValue("0")).toBe(0)
      expect(setORMQueryFilterValue("1")).toBe(1)
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as a number"),
      )
      expect(() => setORMQueryFilterValue("-Infinity")).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setORMQueryFilterValue("Infinity")).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setORMQueryFilterValue("1.1")).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'integer({"autoIncrement":true})',
        orm: {
          sequelize: {
            type: "INTEGER",
            typeArgs: [],
            allowNull: true,
            autoIncrement: true,
            primaryKey: false,
          },
        },
        control: {
          type: "Number",
          allowNull: true,
          min: -Infinity,
          max: Infinity,
          primary: false,
          step: 1,
        },
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      })
    })
  })

  describe("integer({primary: true})", () => {
    const type = integer({ primary: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'integer({"primary":true})',
        orm: {
          sequelize: {
            type: "INTEGER",
            typeArgs: [],
            allowNull: undefined,
            autoIncrement: undefined,
            primaryKey: true,
          },
        },
        control: {
          type: "Number",
          allowNull: undefined,
          min: undefined,
          max: undefined,
          primary: true,
          step: 1,
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
      expect(serializeORMPropertyValue(-1)).toBe(-1)
      expect(serializeORMPropertyValue(0)).toBe(0)
      expect(serializeORMPropertyValue(1)).toBe(1)
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))
      expect(() => serializeORMPropertyValue(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue(-1)).toBe(-1)
      expect(setORMPropertyValue(0)).toBe(0)
      expect(setORMPropertyValue(1)).toBe(1)
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMPropertyValue("invalid" as unknown as number)).toThrow(
        new HatchifyCoerceError("as a number"),
      )
      expect(() => setORMPropertyValue(-Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setORMPropertyValue(Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setORMPropertyValue(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("-1")).toBe(-1)
      expect(setORMQueryFilterValue("0")).toBe(0)
      expect(setORMQueryFilterValue("1")).toBe(1)
      expect(() => setORMQueryFilterValue("null")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("undefined")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as a number"),
      )
      expect(() => setORMQueryFilterValue("-Infinity")).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setORMQueryFilterValue("Infinity")).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setORMQueryFilterValue("1.1")).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'integer({"primary":true})',
        orm: {
          sequelize: {
            type: "INTEGER",
            typeArgs: [],
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
          },
        },
        control: {
          type: "Number",
          allowNull: false,
          min: -Infinity,
          max: Infinity,
          primary: true,
          step: 1,
        },
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      })
    })
  })
})
