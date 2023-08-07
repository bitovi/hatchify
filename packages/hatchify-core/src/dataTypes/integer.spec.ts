import { integer } from "./integer"

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
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      })
    })

    it("transforms correctly", () => {
      const {
        serializeORMPropertyValue,
        setORMPropertyValue,
        setORMQueryFilterValue,
      } = type

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue(-1)).toBe(-1)
      expect(serializeORMPropertyValue(0)).toBe(0)
      expect(serializeORMPropertyValue(1)).toBe(1)
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new Error("Provided value is not a number"))
      expect(() => serializeORMPropertyValue(1.1)).toThrow(
        new Error("Provided value violates the step of 1"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue(-1)).toBe(-1)
      expect(setORMPropertyValue(0)).toBe(0)
      expect(setORMPropertyValue(1)).toBe(1)

      expect(setORMPropertyValue(null)).toBeNull()
      expect(() => setORMPropertyValue("invalid" as unknown as number)).toThrow(
        new Error("Provided value is not a number"),
      )
      expect(() => setORMPropertyValue(-Infinity)).toThrow(
        new Error("Infinity as a value is not supported"),
      )
      expect(() => setORMPropertyValue(Infinity)).toThrow(
        new Error("Infinity as a value is not supported"),
      )
      expect(() => setORMPropertyValue(1.1)).toThrow(
        new Error("Provided value violates the step of 1"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("-1")).toBe(-1)
      expect(setORMQueryFilterValue("0")).toBe(0)
      expect(setORMQueryFilterValue("1")).toBe(1)
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new Error("Provided value is not a number"),
      )
      expect(() => setORMQueryFilterValue("-Infinity")).toThrow(
        new Error("Infinity as a value is not supported"),
      )
      expect(() => setORMQueryFilterValue("Infinity")).toThrow(
        new Error("Infinity as a value is not supported"),
      )
      expect(() => setORMQueryFilterValue("1.1")).toThrow(
        new Error("Provided value violates the step of 1"),
      )
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
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      })
    })

    it("transforms correctly", () => {
      const {
        serializeORMPropertyValue,
        setORMPropertyValue,
        setORMQueryFilterValue,
      } = type

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue(-1)).toBe(-1)
      expect(serializeORMPropertyValue(0)).toBe(0)
      expect(serializeORMPropertyValue(1)).toBe(1)
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new Error("Non-null value is required"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new Error("Provided value is not a number"))
      expect(() => serializeORMPropertyValue(1.1)).toThrow(
        new Error("Provided value violates the step of 1"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue(-1)).toBe(-1)
      expect(setORMPropertyValue(0)).toBe(0)
      expect(setORMPropertyValue(1)).toBe(1)
      expect(() => setORMPropertyValue(null)).toThrow(
        new Error("Non-null value is required"),
      )
      expect(() => setORMPropertyValue("invalid" as unknown as number)).toThrow(
        new Error("Provided value is not a number"),
      )
      expect(() => setORMPropertyValue(-Infinity)).toThrow(
        new Error("Infinity as a value is not supported"),
      )
      expect(() => setORMPropertyValue(Infinity)).toThrow(
        new Error("Infinity as a value is not supported"),
      )
      expect(() => setORMPropertyValue(1.1)).toThrow(
        new Error("Provided value violates the step of 1"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("-1")).toBe(-1)
      expect(setORMQueryFilterValue("0")).toBe(0)
      expect(setORMQueryFilterValue("1")).toBe(1)
      expect(() => setORMQueryFilterValue("null")).toThrow(
        new Error("Non-null value is required"),
      )
      expect(() => setORMQueryFilterValue("undefined")).toThrow(
        new Error("Non-null value is required"),
      )
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new Error("Provided value is not a number"),
      )
      expect(() => setORMQueryFilterValue("-Infinity")).toThrow(
        new Error("Infinity as a value is not supported"),
      )
      expect(() => setORMQueryFilterValue("Infinity")).toThrow(
        new Error("Infinity as a value is not supported"),
      )
      expect(() => setORMQueryFilterValue("1.1")).toThrow(
        new Error("Provided value violates the step of 1"),
      )
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
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      })
    })

    it("transforms correctly", () => {
      const {
        serializeORMPropertyValue,
        setORMPropertyValue,
        setORMQueryFilterValue,
      } = type

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue(-1)).toBe(-1)
      expect(serializeORMPropertyValue(0)).toBe(0)
      expect(serializeORMPropertyValue(1)).toBe(1)
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new Error("Provided value is not a number"))
      expect(() => serializeORMPropertyValue(1.1)).toThrow(
        new Error("Provided value violates the step of 1"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue(-1)).toBe(-1)
      expect(setORMPropertyValue(0)).toBe(0)
      expect(setORMPropertyValue(1)).toBe(1)
      expect(setORMPropertyValue(null)).toBeNull()
      expect(() => setORMPropertyValue("invalid" as unknown as number)).toThrow(
        new Error("Provided value is not a number"),
      )
      expect(() => setORMPropertyValue(-Infinity)).toThrow(
        new Error("Infinity as a value is not supported"),
      )
      expect(() => setORMPropertyValue(Infinity)).toThrow(
        new Error("Infinity as a value is not supported"),
      )
      expect(() => setORMPropertyValue(1.1)).toThrow(
        new Error("Provided value violates the step of 1"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("-1")).toBe(-1)
      expect(setORMQueryFilterValue("0")).toBe(0)
      expect(setORMQueryFilterValue("1")).toBe(1)
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new Error("Provided value is not a number"),
      )
      expect(() => setORMQueryFilterValue("-Infinity")).toThrow(
        new Error("Infinity as a value is not supported"),
      )
      expect(() => setORMQueryFilterValue("Infinity")).toThrow(
        new Error("Infinity as a value is not supported"),
      )
      expect(() => setORMQueryFilterValue("1.1")).toThrow(
        new Error("Provided value violates the step of 1"),
      )
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
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      })
    })

    it("transforms correctly", () => {
      const {
        serializeORMPropertyValue,
        setORMPropertyValue,
        setORMQueryFilterValue,
      } = type

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue(-1)).toBe(-1)
      expect(serializeORMPropertyValue(0)).toBe(0)
      expect(serializeORMPropertyValue(1)).toBe(1)
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new Error("Provided value is not a number"))
      expect(() => serializeORMPropertyValue(1.1)).toThrow(
        new Error("Provided value violates the step of 1"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue(-1)).toBe(-1)
      expect(setORMPropertyValue(0)).toBe(0)
      expect(setORMPropertyValue(1)).toBe(1)
      expect(setORMPropertyValue(null)).toBeNull()
      expect(() => setORMPropertyValue("invalid" as unknown as number)).toThrow(
        new Error("Provided value is not a number"),
      )
      expect(() => setORMPropertyValue(-Infinity)).toThrow(
        new Error("Infinity as a value is not supported"),
      )
      expect(() => setORMPropertyValue(Infinity)).toThrow(
        new Error("Infinity as a value is not supported"),
      )
      expect(() => setORMPropertyValue(1.1)).toThrow(
        new Error("Provided value violates the step of 1"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("-1")).toBe(-1)
      expect(setORMQueryFilterValue("0")).toBe(0)
      expect(setORMQueryFilterValue("1")).toBe(1)
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new Error("Provided value is not a number"),
      )
      expect(() => setORMQueryFilterValue("-Infinity")).toThrow(
        new Error("Infinity as a value is not supported"),
      )
      expect(() => setORMQueryFilterValue("Infinity")).toThrow(
        new Error("Infinity as a value is not supported"),
      )
      expect(() => setORMQueryFilterValue("1.1")).toThrow(
        new Error("Provided value violates the step of 1"),
      )
    })
  })
})
