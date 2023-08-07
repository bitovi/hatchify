import { number, validateStep } from "./number"

describe("number", () => {
  describe("validateStep", () => {
    it("without minimum", () => {
      const step = 0.1

      expect(validateStep(0, step)).toBe(true)
      expect(validateStep(1, step)).toBe(true)
      expect(validateStep(0.1, step)).toBe(true)
      expect(validateStep(-0.1, step)).toBe(true)
      expect(validateStep(0.11, step)).toBe(false)
      expect(validateStep(-0.11, step)).toBe(false)
      expect(validateStep(null as unknown as number, step)).toBe(false)
      expect(validateStep(undefined as unknown as number, step)).toBe(false)
    })

    it("with minimum", () => {
      const step = 0.1
      const min = -0.01

      // ..., -1.11, -1.01, ..., -0.21, -0.11, -0.01, 0.09, 0.19,...

      expect(validateStep(0, step, min)).toBe(false)
      expect(validateStep(1, step, min)).toBe(false)
      expect(validateStep(0.1, step, min)).toBe(false)
      expect(validateStep(-0.1, step, min)).toBe(false)
      expect(validateStep(0.09, step, min)).toBe(true)
      expect(validateStep(0.11, step, min)).toBe(false)
      expect(validateStep(0.19, step, min)).toBe(true)
      expect(validateStep(-0.11, step, min)).toBe(true)
      expect(validateStep(0.01, step, min)).toBe(false)
      expect(validateStep(1.01, step, min)).toBe(false)
      expect(validateStep(0.111, step, min)).toBe(false)
      expect(validateStep(-0.111, step, min)).toBe(false)
      expect(validateStep(null as unknown as number, step, min)).toBe(false)
      expect(validateStep(undefined as unknown as number, step, min)).toBe(
        false,
      )
    })
  })
  describe("number()", () => {
    const type = number()

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: "number()",
        orm: {
          sequelize: {
            type: "DOUBLE",
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
          step: undefined,
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
      expect(serializeORMPropertyValue(1.1)).toBe(1.1)
      expect(serializeORMPropertyValue(1.11)).toBe(1.11)
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new Error("Provided value is not a number"))

      // setORMPropertyValue
      expect(setORMPropertyValue(-1)).toBe(-1)
      expect(setORMPropertyValue(0)).toBe(0)
      expect(setORMPropertyValue(1)).toBe(1)
      expect(setORMPropertyValue(1.1)).toBe(1.1)
      expect(setORMPropertyValue(1.11)).toBe(1.11)

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

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("-1")).toBe(-1)
      expect(setORMQueryFilterValue("0")).toBe(0)
      expect(setORMQueryFilterValue("1")).toBe(1)
      expect(setORMQueryFilterValue("1.1")).toBe(1.1)
      expect(setORMQueryFilterValue("1.11")).toBe(1.11)
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
    })
  })

  describe("number({required: true})", () => {
    const type = number({ required: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'number({"required":true})',
        orm: {
          sequelize: {
            type: "DOUBLE",
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
          step: undefined,
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
      expect(serializeORMPropertyValue(1.1)).toBe(1.1)
      expect(serializeORMPropertyValue(1.11)).toBe(1.11)
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new Error("Non-null value is required"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new Error("Provided value is not a number"))

      // setORMPropertyValue
      expect(setORMPropertyValue(-1)).toBe(-1)
      expect(setORMPropertyValue(0)).toBe(0)
      expect(setORMPropertyValue(1)).toBe(1)
      expect(setORMPropertyValue(1.1)).toBe(1.1)
      expect(setORMPropertyValue(1.11)).toBe(1.11)
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

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("-1")).toBe(-1)
      expect(setORMQueryFilterValue("0")).toBe(0)
      expect(setORMQueryFilterValue("1")).toBe(1)
      expect(setORMQueryFilterValue("1.1")).toBe(1.1)
      expect(setORMQueryFilterValue("1.11")).toBe(1.11)
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
    })
  })

  describe("number({autoIncrement: true})", () => {
    const type = number({ autoIncrement: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'number({"autoIncrement":true})',
        orm: {
          sequelize: {
            type: "DOUBLE",
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
          step: undefined,
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
      expect(serializeORMPropertyValue(1.1)).toBe(1.1)
      expect(serializeORMPropertyValue(1.11)).toBe(1.11)
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new Error("Provided value is not a number"))

      // setORMPropertyValue
      expect(setORMPropertyValue(-1)).toBe(-1)
      expect(setORMPropertyValue(0)).toBe(0)
      expect(setORMPropertyValue(1)).toBe(1)
      expect(setORMPropertyValue(1.1)).toBe(1.1)
      expect(setORMPropertyValue(1.11)).toBe(1.11)
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

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("-1")).toBe(-1)
      expect(setORMQueryFilterValue("0")).toBe(0)
      expect(setORMQueryFilterValue("1")).toBe(1)
      expect(setORMQueryFilterValue("1.1")).toBe(1.1)
      expect(setORMQueryFilterValue("1.11")).toBe(1.11)
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
    })
  })

  describe("number({primary: true})", () => {
    const type = number({ primary: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'number({"primary":true})',
        orm: {
          sequelize: {
            type: "DOUBLE",
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
          step: undefined,
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
      expect(serializeORMPropertyValue(1.1)).toBe(1.1)
      expect(serializeORMPropertyValue(1.11)).toBe(1.11)
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new Error("Provided value is not a number"))

      // setORMPropertyValue
      expect(setORMPropertyValue(-1)).toBe(-1)
      expect(setORMPropertyValue(0)).toBe(0)
      expect(setORMPropertyValue(1)).toBe(1)
      expect(setORMPropertyValue(1.1)).toBe(1.1)
      expect(setORMPropertyValue(1.11)).toBe(1.11)
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

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("-1")).toBe(-1)
      expect(setORMQueryFilterValue("0")).toBe(0)
      expect(setORMQueryFilterValue("1")).toBe(1)
      expect(setORMQueryFilterValue("1.1")).toBe(1.1)
      expect(setORMQueryFilterValue("1.11")).toBe(1.11)
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
    })
  })

  describe("number({step: 0.1})", () => {
    const type = number({ step: 0.1 })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'number({"step":0.1})',
        orm: {
          sequelize: {
            type: "DOUBLE",
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
      } = type

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

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'number({"min":1,"max":10})',
        orm: {
          sequelize: {
            type: "DOUBLE",
            typeArgs: [],
            allowNull: undefined,
            autoIncrement: undefined,
            primaryKey: undefined,
            validate: { min: 1, max: 10 },
          },
        },
        control: {
          type: "Number",
          allowNull: undefined,
          min: 1,
          max: 10,
          primary: undefined,
          step: undefined,
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
      expect(serializeORMPropertyValue(1)).toBe(1)
      expect(serializeORMPropertyValue(1.1)).toBe(1.1)
      expect(serializeORMPropertyValue(1.11)).toBe(1.11)
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

      // setORMPropertyValue
      expect(setORMPropertyValue(1)).toBe(1)
      expect(setORMPropertyValue(1.1)).toBe(1.1)
      expect(setORMPropertyValue(1.11)).toBe(1.11)
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

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("1")).toBe(1)
      expect(setORMQueryFilterValue("1.1")).toBe(1.1)
      expect(setORMQueryFilterValue("1.11")).toBe(1.11)
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
    })
  })
})
