import { number } from "./number"

describe("number", () => {
  describe("number()", () => {
    const type = number()

    it("assumes defaults correctly", () => {
      expect(type.getControlType()).toEqual({
        allowNull: true,
        autoIncrement: false,
        min: -Infinity,
        max: Infinity,
        primary: false,
        step: 0.1,
      })
    })

    it("prepares correctly", () => {
      expect(type.prepare()).toEqual({
        name: "number()",
        orm: {
          sequelize: {
            type: "DOUBLE",
            typeArgs: [],
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            validate: { min: -Infinity, max: Infinity },
          },
        },
        controlType: {
          type: "Number",
          allowNull: true,
          min: -Infinity,
          max: Infinity,
          primary: false,
          step: 0.1,
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
      } = type.prepare()

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue(-1)).toBe(-1)
      expect(serializeORMPropertyValue(0)).toBe(0)
      expect(serializeORMPropertyValue(1)).toBe(1)
      expect(serializeORMPropertyValue(1.1)).toBe(1.1)
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new Error("Provided value is not a number"))
      expect(() => serializeORMPropertyValue(1.11)).toThrow(
        new Error("Provided value violates the step of 0.1"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue(-1)).toBe(-1)
      expect(setORMPropertyValue(0)).toBe(0)
      expect(setORMPropertyValue(1)).toBe(1)
      expect(setORMPropertyValue(1.1)).toBe(1.1)

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
      expect(() => setORMPropertyValue(1.11)).toThrow(
        new Error("Provided value violates the step of 0.1"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("-1")).toBe(-1)
      expect(setORMQueryFilterValue("0")).toBe(0)
      expect(setORMQueryFilterValue("1")).toBe(1)
      expect(setORMQueryFilterValue("1.1")).toBe(1.1)
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
      expect(() => setORMQueryFilterValue("1.11")).toThrow(
        new Error("Provided value violates the step of 0.1"),
      )
    })
  })

  describe("number({required: true})", () => {
    const type = number({ required: true })

    it("assumes defaults correctly", () => {
      expect(type.getControlType()).toEqual({
        allowNull: false,
        autoIncrement: false,
        min: -Infinity,
        max: Infinity,
        primary: false,
        step: 0.1,
      })
    })

    it("prepares correctly", () => {
      expect(type.prepare()).toEqual({
        name: 'number({"required":true})',
        orm: {
          sequelize: {
            type: "DOUBLE",
            typeArgs: [],
            allowNull: false,
            autoIncrement: false,
            primaryKey: false,
            validate: { min: -Infinity, max: Infinity },
          },
        },
        controlType: {
          type: "Number",
          allowNull: false,
          min: -Infinity,
          max: Infinity,
          primary: false,
          step: 0.1,
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
      } = type.prepare()

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue(-1)).toBe(-1)
      expect(serializeORMPropertyValue(0)).toBe(0)
      expect(serializeORMPropertyValue(1)).toBe(1)
      expect(serializeORMPropertyValue(1.1)).toBe(1.1)
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new Error("Non-null value is required"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new Error("Provided value is not a number"))
      expect(() => serializeORMPropertyValue(1.11)).toThrow(
        new Error("Provided value violates the step of 0.1"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue(-1)).toBe(-1)
      expect(setORMPropertyValue(0)).toBe(0)
      expect(setORMPropertyValue(1)).toBe(1)
      expect(setORMPropertyValue(1.1)).toBe(1.1)
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
      expect(() => setORMPropertyValue(1.11)).toThrow(
        new Error("Provided value violates the step of 0.1"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("-1")).toBe(-1)
      expect(setORMQueryFilterValue("0")).toBe(0)
      expect(setORMQueryFilterValue("1")).toBe(1)
      expect(setORMQueryFilterValue("1.1")).toBe(1.1)
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
      expect(() => setORMQueryFilterValue("1.11")).toThrow(
        new Error("Provided value violates the step of 0.1"),
      )
    })
  })

  describe("number({autoIncrement: true})", () => {
    const type = number({ autoIncrement: true })

    it("assumes defaults correctly", () => {
      expect(type.getControlType()).toEqual({
        allowNull: true,
        autoIncrement: true,
        min: -Infinity,
        max: Infinity,
        primary: false,
        step: 0.1,
      })
    })

    it("prepares correctly", () => {
      expect(type.prepare()).toEqual({
        name: 'number({"autoIncrement":true})',
        orm: {
          sequelize: {
            type: "DOUBLE",
            typeArgs: [],
            allowNull: true,
            autoIncrement: true,
            primaryKey: false,
            validate: { min: -Infinity, max: Infinity },
          },
        },
        controlType: {
          type: "Number",
          allowNull: true,
          min: -Infinity,
          max: Infinity,
          primary: false,
          step: 0.1,
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
      } = type.prepare()

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue(-1)).toBe(-1)
      expect(serializeORMPropertyValue(0)).toBe(0)
      expect(serializeORMPropertyValue(1)).toBe(1)
      expect(serializeORMPropertyValue(1.1)).toBe(1.1)
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new Error("Provided value is not a number"))
      expect(() => serializeORMPropertyValue(1.11)).toThrow(
        new Error("Provided value violates the step of 0.1"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue(-1)).toBe(-1)
      expect(setORMPropertyValue(0)).toBe(0)
      expect(setORMPropertyValue(1)).toBe(1)
      expect(setORMPropertyValue(1.1)).toBe(1.1)
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
      expect(() => setORMPropertyValue(1.11)).toThrow(
        new Error("Provided value violates the step of 0.1"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("-1")).toBe(-1)
      expect(setORMQueryFilterValue("0")).toBe(0)
      expect(setORMQueryFilterValue("1")).toBe(1)
      expect(setORMQueryFilterValue("1.1")).toBe(1.1)
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
      expect(() => setORMQueryFilterValue("1.11")).toThrow(
        new Error("Provided value violates the step of 0.1"),
      )
    })
  })

  describe("number({primary: true})", () => {
    const type = number({ primary: true })

    it("assumes defaults correctly", () => {
      expect(type.getControlType()).toEqual({
        allowNull: true,
        autoIncrement: false,
        min: -Infinity,
        max: Infinity,
        primary: true,
        step: 0.1,
      })
    })

    it("prepares correctly", () => {
      expect(type.prepare()).toEqual({
        name: 'number({"primary":true})',
        orm: {
          sequelize: {
            type: "DOUBLE",
            typeArgs: [],
            allowNull: true,
            autoIncrement: false,
            primaryKey: true,
            validate: { min: -Infinity, max: Infinity },
          },
        },
        controlType: {
          type: "Number",
          allowNull: true,
          min: -Infinity,
          max: Infinity,
          primary: true,
          step: 0.1,
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
      } = type.prepare()

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue(-1)).toBe(-1)
      expect(serializeORMPropertyValue(0)).toBe(0)
      expect(serializeORMPropertyValue(1)).toBe(1)
      expect(serializeORMPropertyValue(1.1)).toBe(1.1)
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new Error("Provided value is not a number"))
      expect(() => serializeORMPropertyValue(1.11)).toThrow(
        new Error("Provided value violates the step of 0.1"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue(-1)).toBe(-1)
      expect(setORMPropertyValue(0)).toBe(0)
      expect(setORMPropertyValue(1)).toBe(1)
      expect(setORMPropertyValue(1.1)).toBe(1.1)
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
      expect(() => setORMPropertyValue(1.11)).toThrow(
        new Error("Provided value violates the step of 0.1"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("-1")).toBe(-1)
      expect(setORMQueryFilterValue("0")).toBe(0)
      expect(setORMQueryFilterValue("1")).toBe(1)
      expect(setORMQueryFilterValue("1.1")).toBe(1.1)
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
      expect(() => setORMQueryFilterValue("1.11")).toThrow(
        new Error("Provided value violates the step of 0.1"),
      )
    })
  })

  describe("number({min: 1, max: 10})", () => {
    const type = number({ min: 1, max: 10 })

    it("assumes defaults correctly", () => {
      expect(type.getControlType()).toEqual({
        allowNull: true,
        autoIncrement: false,
        min: 1,
        max: 10,
        primary: false,
        step: 0.1,
      })
    })

    it("prepares correctly", () => {
      expect(type.prepare()).toEqual({
        name: 'number({"min":1,"max":10})',
        orm: {
          sequelize: {
            type: "DOUBLE",
            typeArgs: [],
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            validate: { min: 1, max: 10 },
          },
        },
        controlType: {
          type: "Number",
          allowNull: true,
          min: 1,
          max: 10,
          primary: false,
          step: 0.1,
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
      } = type.prepare()

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue(1)).toBe(1)
      expect(serializeORMPropertyValue(1.1)).toBe(1.1)
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() => serializeORMPropertyValue(-1)).toThrow(
        new Error("Provided value is lower than the minimum of 1"),
      )
      expect(() => serializeORMPropertyValue(0)).toThrow(
        new Error("Provided value is lower than the minimum of 1"),
      )
      expect(() => serializeORMPropertyValue(0.9)).toThrow(
        new Error("Provided value is lower than the minimum of 1"),
      )
      expect(() => serializeORMPropertyValue(10.1)).toThrow(
        new Error("Provided value is higher than the maximum of 10"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new Error("Provided value is not a number"))
      expect(() => serializeORMPropertyValue(1.11)).toThrow(
        new Error("Provided value violates the step of 0.1"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue(1)).toBe(1)
      expect(setORMPropertyValue(1.1)).toBe(1.1)

      expect(setORMPropertyValue(null)).toBeNull()
      expect(() => setORMPropertyValue(-1)).toThrow(
        new Error("Provided value is lower than the minimum of 1"),
      )
      expect(() => setORMPropertyValue(0)).toThrow(
        new Error("Provided value is lower than the minimum of 1"),
      )
      expect(() => setORMPropertyValue(0.9)).toThrow(
        new Error("Provided value is lower than the minimum of 1"),
      )
      expect(() => setORMPropertyValue(10.1)).toThrow(
        new Error("Provided value is higher than the maximum of 10"),
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
      expect(() => setORMPropertyValue(1.11)).toThrow(
        new Error("Provided value violates the step of 0.1"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("1")).toBe(1)
      expect(setORMQueryFilterValue("1.1")).toBe(1.1)
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("-1")).toThrow(
        new Error("Provided value is lower than the minimum of 1"),
      )
      expect(() => setORMQueryFilterValue("0")).toThrow(
        new Error("Provided value is lower than the minimum of 1"),
      )
      expect(() => setORMQueryFilterValue("0.9")).toThrow(
        new Error("Provided value is lower than the minimum of 1"),
      )
      expect(() => setORMQueryFilterValue("10.1")).toThrow(
        new Error("Provided value is higher than the maximum of 10"),
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
      expect(() => setORMQueryFilterValue("1.11")).toThrow(
        new Error("Provided value violates the step of 0.1"),
      )
    })
  })
})
