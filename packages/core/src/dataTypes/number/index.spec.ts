import { HatchifyCoerceError } from "../../types"

import { number } from "."

describe("number", () => {
  describe("number()", () => {
    const type = number()

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: "number()",
        orm: {
          sequelize: {
            type: "DECIMAL",
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
      expect(setClientPropertyValue?.(-1)).toBe(-1)
      expect(setClientPropertyValue?.(0)).toBe(0)
      expect(setClientPropertyValue?.(1)).toBe(1)
      expect(setClientPropertyValue?.(1.1)).toBe(1.1)
      expect(setClientPropertyValue?.(1.11)).toBe(1.11)
      expect(setClientPropertyValue?.(null)).toBeNull()
      expect(
        () => setClientPropertyValue?.("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))
      expect(() => setClientPropertyValue?.(-Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setClientPropertyValue?.(Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )

      // serializeClientPropertyValue
      expect(serializeClientPropertyValue?.(-1)).toBe(-1)
      expect(serializeClientPropertyValue?.(0)).toBe(0)
      expect(serializeClientPropertyValue?.(1)).toBe(1)
      expect(serializeClientPropertyValue?.(1.1)).toBe(1.1)
      expect(serializeClientPropertyValue?.(1.11)).toBe(1.11)
      expect(serializeClientPropertyValue?.(null)).toBeNull()
      // This function expects valid data, so it won't throw an error.
      expect(
        serializeClientPropertyValue?.("invalid" as unknown as number),
      ).toBe("invalid")

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.(-1)).toBe(-1)
      expect(setClientQueryFilterValue?.(0)).toBe(0)
      expect(setClientQueryFilterValue?.(1)).toBe(1)
      expect(setClientQueryFilterValue?.(1.1)).toBe(1.1)
      expect(setClientQueryFilterValue?.(1.11)).toBe(1.11)
      expect(setClientQueryFilterValue?.(null)).toBeNull()
      expect(
        () => setClientQueryFilterValue?.("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))
      expect(() => setClientQueryFilterValue?.(-Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setClientQueryFilterValue?.(Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )

      // serializeClientQueryFilterValue
      expect(serializeClientQueryFilterValue?.(-1)).toBe("-1")
      expect(serializeClientQueryFilterValue?.(0)).toBe("0")
      expect(serializeClientQueryFilterValue?.(1)).toBe("1")
      expect(serializeClientQueryFilterValue?.(1.1)).toBe("1.1")
      expect(serializeClientQueryFilterValue?.(1.11)).toBe("1.11")
      expect(serializeClientQueryFilterValue?.(null)).toBe("null")
      // This function expects valid data, so it won't throw an error.
      expect(
        serializeClientQueryFilterValue?.("invalid" as unknown as number),
      ).toBe('"invalid"')

      // setClientPropertyValueFromResponse
      expect(setClientPropertyValueFromResponse?.(-1)).toBe(-1)
      expect(setClientPropertyValueFromResponse?.(0)).toBe(0)
      expect(setClientPropertyValueFromResponse?.(1)).toBe(1)
      expect(setClientPropertyValueFromResponse?.(1.1)).toBe(1.1)
      expect(setClientPropertyValueFromResponse?.(1.11)).toBe(1.11)
      expect(setClientPropertyValueFromResponse?.("1.1")).toBe(1.1)
      expect(setClientPropertyValueFromResponse?.("1.11")).toBe(1.11)
      expect(setClientPropertyValueFromResponse?.(null)).toBeNull()
      expect(
        () =>
          setClientPropertyValueFromResponse?.("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))
      expect(() => setClientPropertyValueFromResponse?.(-Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setClientPropertyValueFromResponse?.(Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue(-1)).toBe(-1)
      expect(serializeORMPropertyValue(0)).toBe(0)
      expect(serializeORMPropertyValue(1)).toBe(1)
      expect(serializeORMPropertyValue(1.1)).toBe(1.1)
      expect(serializeORMPropertyValue(1.11)).toBe(1.11)
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))

      // setORMPropertyValue
      expect(setORMPropertyValue(-1)).toBe(-1)
      expect(setORMPropertyValue(0)).toBe(0)
      expect(setORMPropertyValue(1)).toBe(1)
      expect(setORMPropertyValue(1.1)).toBe(1.1)
      expect(setORMPropertyValue(1.11)).toBe(1.11)

      expect(setORMPropertyValue(null)).toBeNull()
      expect(setORMPropertyValue(undefined)).toBeNull()
      expect(() => setORMPropertyValue("invalid" as unknown as number)).toThrow(
        new HatchifyCoerceError("as a number"),
      )
      expect(() => setORMPropertyValue(-Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setORMPropertyValue(Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
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
        new HatchifyCoerceError("as a number"),
      )
      expect(() => setORMQueryFilterValue("-Infinity")).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setORMQueryFilterValue("Infinity")).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: "number()",
        orm: {
          sequelize: {
            type: "DECIMAL",
            typeArgs: [],
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "Number",
          ui: { displayName: null },
          allowNull: true,
          min: -Infinity,
          max: Infinity,
          primary: false,
          default: null,
          step: 0,
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

  describe("number({required: true})", () => {
    const type = number({ required: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'number({"required":true})',
        orm: {
          sequelize: {
            type: "DECIMAL",
            typeArgs: [],
            allowNull: false,
            autoIncrement: undefined,
            primaryKey: undefined,
          },
        },
        control: {
          type: "Number",
          allowNull: false,
          allowNullInfer: false,
          min: undefined,
          max: undefined,
          primary: undefined,
          step: undefined,
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
      expect(setClientPropertyValue?.(-1)).toBe(-1)
      expect(setClientPropertyValue?.(0)).toBe(0)
      expect(setClientPropertyValue?.(1)).toBe(1)
      expect(setClientPropertyValue?.(1.1)).toBe(1.1)
      expect(setClientPropertyValue?.(1.11)).toBe(1.11)
      expect(() => setClientPropertyValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(
        () => setClientPropertyValue?.("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))
      expect(() => setClientPropertyValue?.(-Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setClientPropertyValue?.(Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )

      // serializeClientPropertyValue
      expect(serializeClientPropertyValue?.(-1)).toBe(-1)
      expect(serializeClientPropertyValue?.(0)).toBe(0)
      expect(serializeClientPropertyValue?.(1)).toBe(1)
      expect(serializeClientPropertyValue?.(1.1)).toBe(1.1)
      expect(serializeClientPropertyValue?.(1.11)).toBe(1.11)
      // This function expects valid data, so it won't throw an error.
      expect(serializeClientPropertyValue?.(null)).toBeNull()
      expect(
        serializeClientPropertyValue?.("invalid" as unknown as number),
      ).toBe("invalid")

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.(-1)).toBe(-1)
      expect(setClientQueryFilterValue?.(0)).toBe(0)
      expect(setClientQueryFilterValue?.(1)).toBe(1)
      expect(setClientQueryFilterValue?.(1.1)).toBe(1.1)
      expect(setClientQueryFilterValue?.(1.11)).toBe(1.11)
      expect(() => setClientQueryFilterValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(
        () => setClientQueryFilterValue?.("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))
      expect(() => setClientQueryFilterValue?.(-Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setClientQueryFilterValue?.(Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )

      // serializeClientQueryFilterValue
      expect(serializeClientQueryFilterValue?.(-1)).toBe("-1")
      expect(serializeClientQueryFilterValue?.(0)).toBe("0")
      expect(serializeClientQueryFilterValue?.(1)).toBe("1")
      expect(serializeClientQueryFilterValue?.(1.1)).toBe("1.1")
      expect(serializeClientQueryFilterValue?.(1.11)).toBe("1.11")
      // This function expects valid data, so it won't throw an error.
      expect(serializeClientQueryFilterValue?.(null)).toBe("null")
      expect(
        serializeClientQueryFilterValue?.("invalid" as unknown as number),
      ).toBe('"invalid"')

      // setClientPropertyValueFromResponse
      expect(setClientPropertyValueFromResponse?.(-1)).toBe(-1)
      expect(setClientPropertyValueFromResponse?.(0)).toBe(0)
      expect(setClientPropertyValueFromResponse?.(1)).toBe(1)
      expect(setClientPropertyValueFromResponse?.(1.1)).toBe(1.1)
      expect(setClientPropertyValueFromResponse?.(1.11)).toBe(1.11)
      expect(setClientPropertyValueFromResponse?.("1")).toBe(1)
      expect(setClientPropertyValueFromResponse?.("1.11")).toBe(1.11)
      expect(() => setClientPropertyValueFromResponse?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(
        () =>
          setClientPropertyValueFromResponse?.("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))
      expect(() => setClientPropertyValueFromResponse?.(-Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setClientPropertyValueFromResponse?.(Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue(-1)).toBe(-1)
      expect(serializeORMPropertyValue(0)).toBe(0)
      expect(serializeORMPropertyValue(1)).toBe(1)
      expect(serializeORMPropertyValue(1.1)).toBe(1.1)
      expect(serializeORMPropertyValue(1.11)).toBe(1.11)
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))

      // setORMPropertyValue
      expect(setORMPropertyValue(-1)).toBe(-1)
      expect(setORMPropertyValue(0)).toBe(0)
      expect(setORMPropertyValue(1)).toBe(1)
      expect(setORMPropertyValue(1.1)).toBe(1.1)
      expect(setORMPropertyValue(1.11)).toBe(1.11)
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMPropertyValue(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
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

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("-1")).toBe(-1)
      expect(setORMQueryFilterValue("0")).toBe(0)
      expect(setORMQueryFilterValue("1")).toBe(1)
      expect(setORMQueryFilterValue("1.1")).toBe(1.1)
      expect(setORMQueryFilterValue("1.11")).toBe(1.11)
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
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'number({"required":true})',
        orm: {
          sequelize: {
            type: "DECIMAL",
            typeArgs: [],
            allowNull: false,
            autoIncrement: false,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "Number",
          ui: { displayName: null },
          allowNull: false,
          min: -Infinity,
          max: Infinity,
          primary: false,
          default: null,
          step: 0,
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

  describe("number({autoIncrement: true})", () => {
    const type = number({ autoIncrement: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'number({"autoIncrement":true})',
        orm: {
          sequelize: {
            type: "DECIMAL",
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
      expect(setClientPropertyValue?.(-1)).toBe(-1)
      expect(setClientPropertyValue?.(0)).toBe(0)
      expect(setClientPropertyValue?.(1)).toBe(1)
      expect(setClientPropertyValue?.(1.1)).toBe(1.1)
      expect(setClientPropertyValue?.(1.11)).toBe(1.11)
      expect(setClientPropertyValue?.(null)).toBeNull()
      expect(
        () => setClientPropertyValue?.("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))
      expect(() => setClientPropertyValue?.(-Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setClientPropertyValue?.(Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )

      // serializeClientPropertyValue
      expect(serializeClientPropertyValue?.(-1)).toBe(-1)
      expect(serializeClientPropertyValue?.(0)).toBe(0)
      expect(serializeClientPropertyValue?.(1)).toBe(1)
      expect(serializeClientPropertyValue?.(1.1)).toBe(1.1)
      expect(serializeClientPropertyValue?.(1.11)).toBe(1.11)
      expect(serializeClientPropertyValue?.(null)).toBeNull()
      // This function expects valid data, so it won't throw an error.
      expect(
        serializeClientPropertyValue?.("invalid" as unknown as number),
      ).toBe("invalid")

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.(-1)).toBe(-1)
      expect(setClientQueryFilterValue?.(0)).toBe(0)
      expect(setClientQueryFilterValue?.(1)).toBe(1)
      expect(setClientQueryFilterValue?.(1.1)).toBe(1.1)
      expect(setClientQueryFilterValue?.(1.11)).toBe(1.11)
      expect(setClientQueryFilterValue?.(null)).toBeNull()
      expect(
        () => setClientQueryFilterValue?.("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))
      expect(() => setClientQueryFilterValue?.(-Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setClientQueryFilterValue?.(Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )

      // serializeClientQueryFilterValue
      expect(serializeClientQueryFilterValue?.(-1)).toBe("-1")
      expect(serializeClientQueryFilterValue?.(0)).toBe("0")
      expect(serializeClientQueryFilterValue?.(1)).toBe("1")
      expect(serializeClientQueryFilterValue?.(1.1)).toBe("1.1")
      expect(serializeClientQueryFilterValue?.(1.11)).toBe("1.11")
      // This function expects valid data, so it won't throw an error.
      expect(serializeClientQueryFilterValue?.(null)).toBe("null")
      expect(
        serializeClientQueryFilterValue?.("invalid" as unknown as number),
      ).toBe('"invalid"')

      // setClientPropertyValueFromResponse
      expect(setClientPropertyValueFromResponse?.(-1)).toBe(-1)
      expect(setClientPropertyValueFromResponse?.(0)).toBe(0)
      expect(setClientPropertyValueFromResponse?.(1)).toBe(1)
      expect(setClientPropertyValueFromResponse?.(1.1)).toBe(1.1)
      expect(setClientPropertyValueFromResponse?.(1.11)).toBe(1.11)
      expect(setClientPropertyValueFromResponse?.("1.1")).toBe(1.1)
      expect(setClientPropertyValueFromResponse?.("1.11")).toBe(1.11)
      expect(setClientPropertyValueFromResponse?.(null)).toBeNull()
      expect(
        () =>
          setClientPropertyValueFromResponse?.("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))
      expect(() => setClientPropertyValueFromResponse?.(-Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setClientPropertyValueFromResponse?.(Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue(-1)).toBe(-1)
      expect(serializeORMPropertyValue(0)).toBe(0)
      expect(serializeORMPropertyValue(1)).toBe(1)
      expect(serializeORMPropertyValue(1.1)).toBe(1.1)
      expect(serializeORMPropertyValue(1.11)).toBe(1.11)
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))

      // setORMPropertyValue
      expect(setORMPropertyValue(-1)).toBe(-1)
      expect(setORMPropertyValue(0)).toBe(0)
      expect(setORMPropertyValue(1)).toBe(1)
      expect(setORMPropertyValue(1.1)).toBe(1.1)
      expect(setORMPropertyValue(1.11)).toBe(1.11)
      expect(setORMPropertyValue(null)).toBeNull()
      expect(setORMPropertyValue(undefined)).toBeNull()
      expect(() => setORMPropertyValue("invalid" as unknown as number)).toThrow(
        new HatchifyCoerceError("as a number"),
      )
      expect(() => setORMPropertyValue(-Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setORMPropertyValue(Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
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
        new HatchifyCoerceError("as a number"),
      )
      expect(() => setORMQueryFilterValue("-Infinity")).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setORMQueryFilterValue("Infinity")).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'number({"autoIncrement":true})',
        orm: {
          sequelize: {
            type: "DECIMAL",
            typeArgs: [],
            allowNull: true,
            autoIncrement: true,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "Number",
          ui: { displayName: null },
          allowNull: true,
          min: -Infinity,
          max: Infinity,
          primary: false,
          default: null,
          step: 0,
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

  describe("number({primary: true})", () => {
    const type = number({ primary: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'number({"primary":true})',
        orm: {
          sequelize: {
            type: "DECIMAL",
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
      expect(setClientPropertyValue?.(-1)).toBe(-1)
      expect(setClientPropertyValue?.(0)).toBe(0)
      expect(setClientPropertyValue?.(1)).toBe(1)
      expect(setClientPropertyValue?.(1.1)).toBe(1.1)
      expect(setClientPropertyValue?.(1.11)).toBe(1.11)
      expect(() => setClientPropertyValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(
        () => setClientPropertyValue?.("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))
      expect(() => setClientPropertyValue?.(-Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setClientPropertyValue?.(Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )

      // serializeClientPropertyValue
      expect(serializeClientPropertyValue?.(-1)).toBe(-1)
      expect(serializeClientPropertyValue?.(0)).toBe(0)
      expect(serializeClientPropertyValue?.(1)).toBe(1)
      expect(serializeClientPropertyValue?.(1.1)).toBe(1.1)
      expect(serializeClientPropertyValue?.(1.11)).toBe(1.11)
      // This function expects valid data, so it won't throw an error.
      expect(serializeClientPropertyValue?.(null)).toBeNull()
      expect(
        serializeClientPropertyValue?.("invalid" as unknown as number),
      ).toBe("invalid")

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.(-1)).toBe(-1)
      expect(setClientQueryFilterValue?.(0)).toBe(0)
      expect(setClientQueryFilterValue?.(1)).toBe(1)
      expect(setClientQueryFilterValue?.(1.1)).toBe(1.1)
      expect(setClientQueryFilterValue?.(1.11)).toBe(1.11)
      expect(() => setClientQueryFilterValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(
        () => setClientQueryFilterValue?.("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))
      expect(() => setClientQueryFilterValue?.(-Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setClientQueryFilterValue?.(Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )

      // serializeClientQueryFilterValue
      expect(serializeClientQueryFilterValue?.(-1)).toBe("-1")
      expect(serializeClientQueryFilterValue?.(0)).toBe("0")
      expect(serializeClientQueryFilterValue?.(1)).toBe("1")
      expect(serializeClientQueryFilterValue?.(1.1)).toBe("1.1")
      expect(serializeClientQueryFilterValue?.(1.11)).toBe("1.11")
      // This function expects valid data, so it won't throw an error.
      expect(serializeClientQueryFilterValue?.(null)).toBe("null")
      expect(
        serializeClientQueryFilterValue?.("invalid" as unknown as number),
      ).toBe('"invalid"')

      // setClientPropertyValueFromResponse
      expect(setClientPropertyValueFromResponse?.(-1)).toBe(-1)
      expect(setClientPropertyValueFromResponse?.(0)).toBe(0)
      expect(setClientPropertyValueFromResponse?.(1)).toBe(1)
      expect(setClientPropertyValueFromResponse?.(1.1)).toBe(1.1)
      expect(setClientPropertyValueFromResponse?.(1.11)).toBe(1.11)
      expect(setClientPropertyValueFromResponse?.("1.1")).toBe(1.1)
      expect(setClientPropertyValueFromResponse?.("1.11")).toBe(1.11)
      expect(() => setClientPropertyValueFromResponse?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(
        () =>
          setClientPropertyValueFromResponse?.("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))
      expect(() => setClientPropertyValueFromResponse?.(-Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setClientPropertyValueFromResponse?.(Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue(-1)).toBe(-1)
      expect(serializeORMPropertyValue(0)).toBe(0)
      expect(serializeORMPropertyValue(1)).toBe(1)
      expect(serializeORMPropertyValue(1.1)).toBe(1.1)
      expect(serializeORMPropertyValue(1.11)).toBe(1.11)
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))

      // setORMPropertyValue
      expect(setORMPropertyValue(-1)).toBe(-1)
      expect(setORMPropertyValue(0)).toBe(0)
      expect(setORMPropertyValue(1)).toBe(1)
      expect(setORMPropertyValue(1.1)).toBe(1.1)
      expect(setORMPropertyValue(1.11)).toBe(1.11)
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMPropertyValue(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
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

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("-1")).toBe(-1)
      expect(setORMQueryFilterValue("0")).toBe(0)
      expect(setORMQueryFilterValue("1")).toBe(1)
      expect(setORMQueryFilterValue("1.1")).toBe(1.1)
      expect(setORMQueryFilterValue("1.11")).toBe(1.11)
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
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'number({"primary":true})',
        orm: {
          sequelize: {
            type: "DECIMAL",
            typeArgs: [],
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            unique: true,
            defaultValue: null,
          },
        },
        control: {
          type: "Number",
          ui: { displayName: null },
          allowNull: false,
          min: -Infinity,
          max: Infinity,
          primary: true,
          default: null,
          step: 0,
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

  describe("number({step: 0.1})", () => {
    const type = number({ step: 0.1 })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'number({"step":0.1})',
        orm: {
          sequelize: {
            type: "DECIMAL",
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
      expect(setClientPropertyValue?.(-1)).toBe(-1)
      expect(setClientPropertyValue?.(0)).toBe(0)
      expect(setClientPropertyValue?.(1)).toBe(1)
      expect(setClientPropertyValue?.(1.1)).toBe(1.1)
      expect(setClientPropertyValue?.(null)).toBeNull()
      expect(() => setClientPropertyValue?.(1.11)).toThrow(
        new HatchifyCoerceError("as multiples of 0.1"),
      )
      expect(
        () => setClientPropertyValue?.("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))
      expect(() => setClientPropertyValue?.(-Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setClientPropertyValue?.(Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )

      // serializeClientPropertyValue
      expect(serializeClientPropertyValue?.(-1)).toBe(-1)
      expect(serializeClientPropertyValue?.(0)).toBe(0)
      expect(serializeClientPropertyValue?.(1)).toBe(1)
      expect(serializeClientPropertyValue?.(1.1)).toBe(1.1)
      // This function expects valid data, so it won't throw an error.
      expect(serializeClientPropertyValue?.(1.11)).toBe(1.11)
      expect(serializeClientPropertyValue?.(null)).toBeNull()
      expect(
        serializeClientPropertyValue?.("invalid" as unknown as number),
      ).toBe("invalid")

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.(-1)).toBe(-1)
      expect(setClientQueryFilterValue?.(0)).toBe(0)
      expect(setClientQueryFilterValue?.(1)).toBe(1)
      expect(setClientQueryFilterValue?.(1.1)).toBe(1.1)
      expect(setClientQueryFilterValue?.(null)).toBeNull()
      expect(() => setClientQueryFilterValue?.(1.11)).toThrow(
        new HatchifyCoerceError("as multiples of 0.1"),
      )
      expect(
        () => setClientQueryFilterValue?.("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))
      expect(() => setClientQueryFilterValue?.(-Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setClientQueryFilterValue?.(Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )

      // serializeClientQueryFilterValue
      expect(serializeClientQueryFilterValue?.(-1)).toBe("-1")
      expect(serializeClientQueryFilterValue?.(0)).toBe("0")
      expect(serializeClientQueryFilterValue?.(1)).toBe("1")
      expect(serializeClientQueryFilterValue?.(1.1)).toBe("1.1")
      // This function expects valid data, so it won't throw an error.
      expect(serializeClientQueryFilterValue?.(1.11)).toBe("1.11")
      expect(serializeClientQueryFilterValue?.(null)).toBe("null")
      expect(
        serializeClientQueryFilterValue?.("invalid" as unknown as number),
      ).toBe('"invalid"')

      // setClientPropertyValueFromResponse
      expect(setClientPropertyValueFromResponse?.(-1)).toBe(-1)
      expect(setClientPropertyValueFromResponse?.(0)).toBe(0)
      expect(setClientPropertyValueFromResponse?.(1)).toBe(1)
      expect(setClientPropertyValueFromResponse?.(1.1)).toBe(1.1)
      expect(setClientPropertyValueFromResponse?.("1")).toBe(1)
      expect(setClientPropertyValueFromResponse?.("1.1")).toBe(1.1)
      expect(setClientPropertyValueFromResponse?.(null)).toBeNull()
      expect(() => setClientPropertyValueFromResponse?.(1.11)).toThrow(
        new HatchifyCoerceError("as multiples of 0.1"),
      )
      expect(
        () =>
          setClientPropertyValueFromResponse?.("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))
      expect(() => setClientPropertyValueFromResponse?.(-Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )
      expect(() => setClientPropertyValueFromResponse?.(Infinity)).toThrow(
        new HatchifyCoerceError("different than Infinity"),
      )

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue(-1)).toBe(-1)
      expect(serializeORMPropertyValue(0)).toBe(0)
      expect(serializeORMPropertyValue(1)).toBe(1)
      expect(serializeORMPropertyValue(1.1)).toBe(1.1)
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))
      expect(() => serializeORMPropertyValue(1.11)).toThrow(
        new HatchifyCoerceError("as multiples of 0.1"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue(-1)).toBe(-1)
      expect(setORMPropertyValue(0)).toBe(0)
      expect(setORMPropertyValue(1)).toBe(1)
      expect(setORMPropertyValue(1.1)).toBe(1.1)
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
      expect(() => setORMPropertyValue(1.11)).toThrow(
        new HatchifyCoerceError("as multiples of 0.1"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("-1")).toBe(-1)
      expect(setORMQueryFilterValue("0")).toBe(0)
      expect(setORMQueryFilterValue("1")).toBe(1)
      expect(setORMQueryFilterValue("1.1")).toBe(1.1)
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
      expect(() => setORMQueryFilterValue("1.11")).toThrow(
        new HatchifyCoerceError("as multiples of 0.1"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'number({"step":0.1})',
        orm: {
          sequelize: {
            type: "DECIMAL",
            typeArgs: [],
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "Number",
          ui: { displayName: null },
          allowNull: true,
          min: -Infinity,
          max: Infinity,
          primary: false,
          default: null,
          step: 0.1,
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

  describe("number({min: 1, max: 10})", () => {
    const type = number({ min: 1, max: 10 })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'number({"min":1,"max":10})',
        orm: {
          sequelize: {
            type: "DECIMAL",
            typeArgs: [],
            allowNull: undefined,
            autoIncrement: undefined,
            primaryKey: undefined,
          },
        },
        control: {
          type: "Number",
          allowNull: undefined,
          min: 1,
          max: 10,
          primary: undefined,
          step: undefined,
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
      expect(setClientPropertyValue?.(1)).toBe(1)
      expect(setClientPropertyValue?.(1.1)).toBe(1.1)
      expect(setClientPropertyValue?.(1.11)).toBe(1.11)
      expect(setClientPropertyValue?.(null)).toBeNull()
      expect(() => setClientPropertyValue?.(-1)).toThrow(
        new HatchifyCoerceError("greater than or equal to 1"),
      )
      expect(() => setClientPropertyValue?.(0)).toThrow(
        new HatchifyCoerceError("greater than or equal to 1"),
      )
      expect(() => setClientPropertyValue?.(0.9)).toThrow(
        new HatchifyCoerceError("greater than or equal to 1"),
      )
      expect(() => setClientPropertyValue?.(10.1)).toThrow(
        new HatchifyCoerceError("less than or equal to 10"),
      )
      expect(
        () => setClientPropertyValue?.("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))

      // serializeClientPropertyValue
      expect(serializeClientPropertyValue?.(1)).toBe(1)
      expect(serializeClientPropertyValue?.(1.1)).toBe(1.1)
      expect(serializeClientPropertyValue?.(1.11)).toBe(1.11)
      expect(serializeClientPropertyValue?.(null)).toBeNull()
      // This function expects valid data, so it won't throw an error.
      expect(serializeClientPropertyValue?.(0)).toBe(0)
      expect(serializeClientPropertyValue?.(0.9)).toBe(0.9)
      expect(serializeClientPropertyValue?.(10.1)).toBe(10.1)
      expect(
        serializeClientPropertyValue?.("invalid" as unknown as number),
      ).toBe("invalid")

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.(1)).toBe(1)
      expect(setClientQueryFilterValue?.(1.1)).toBe(1.1)
      expect(setClientQueryFilterValue?.(1.11)).toBe(1.11)
      expect(setClientQueryFilterValue?.(null)).toBeNull()
      expect(() => setClientQueryFilterValue?.(-1)).toThrow(
        new HatchifyCoerceError("greater than or equal to 1"),
      )
      expect(() => setClientQueryFilterValue?.(0)).toThrow(
        new HatchifyCoerceError("greater than or equal to 1"),
      )
      expect(() => setClientQueryFilterValue?.(0.9)).toThrow(
        new HatchifyCoerceError("greater than or equal to 1"),
      )
      expect(() => setClientQueryFilterValue?.(10.1)).toThrow(
        new HatchifyCoerceError("less than or equal to 10"),
      )
      expect(
        () => setClientQueryFilterValue?.("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))

      // serializeClientQueryFilterValue
      expect(serializeClientQueryFilterValue?.(1)).toBe("1")
      expect(serializeClientQueryFilterValue?.(1.1)).toBe("1.1")
      expect(serializeClientQueryFilterValue?.(1.11)).toBe("1.11")
      expect(serializeClientQueryFilterValue?.(null)).toBe("null")
      // This function expects valid data, so it won't throw an error.
      expect(serializeClientQueryFilterValue?.(0)).toBe("0")
      expect(serializeClientQueryFilterValue?.(0.9)).toBe("0.9")
      expect(serializeClientQueryFilterValue?.(10.1)).toBe("10.1")
      expect(
        serializeClientQueryFilterValue?.("invalid" as unknown as number),
      ).toBe('"invalid"')

      // setClientPropertyValueFromResponse
      expect(setClientPropertyValueFromResponse?.(1)).toBe(1)
      expect(setClientPropertyValueFromResponse?.(1.1)).toBe(1.1)
      expect(setClientPropertyValueFromResponse?.(1.11)).toBe(1.11)
      expect(setClientPropertyValueFromResponse?.("1.1")).toBe(1.1)
      expect(setClientPropertyValueFromResponse?.("1.11")).toBe(1.11)
      expect(setClientPropertyValueFromResponse?.(null)).toBeNull()
      expect(() => setClientPropertyValueFromResponse?.(-1)).toThrow(
        new HatchifyCoerceError("greater than or equal to 1"),
      )
      expect(() => setClientPropertyValueFromResponse?.(0)).toThrow(
        new HatchifyCoerceError("greater than or equal to 1"),
      )
      expect(() => setClientPropertyValueFromResponse?.(0.9)).toThrow(
        new HatchifyCoerceError("greater than or equal to 1"),
      )
      expect(() => setClientPropertyValueFromResponse?.(10.1)).toThrow(
        new HatchifyCoerceError("less than or equal to 10"),
      )
      expect(
        () =>
          setClientPropertyValueFromResponse?.("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue(1)).toBe(1)
      expect(serializeORMPropertyValue(1.1)).toBe(1.1)
      expect(serializeORMPropertyValue(1.11)).toBe(1.11)
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() => serializeORMPropertyValue(-1)).toThrow(
        new HatchifyCoerceError("greater than or equal to 1"),
      )
      expect(() => serializeORMPropertyValue(0)).toThrow(
        new HatchifyCoerceError("greater than or equal to 1"),
      )
      expect(() => serializeORMPropertyValue(0.9)).toThrow(
        new HatchifyCoerceError("greater than or equal to 1"),
      )
      expect(() => serializeORMPropertyValue(10.1)).toThrow(
        new HatchifyCoerceError("less than or equal to 10"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as number),
      ).toThrow(new HatchifyCoerceError("as a number"))

      // setORMPropertyValue
      expect(setORMPropertyValue(1)).toBe(1)
      expect(setORMPropertyValue(1.1)).toBe(1.1)
      expect(setORMPropertyValue(1.11)).toBe(1.11)
      expect(setORMPropertyValue(null)).toBeNull()
      expect(setORMPropertyValue(undefined)).toBeNull()
      expect(() => setORMPropertyValue(-1)).toThrow(
        new HatchifyCoerceError("greater than or equal to 1"),
      )
      expect(() => setORMPropertyValue(0)).toThrow(
        new HatchifyCoerceError("greater than or equal to 1"),
      )
      expect(() => setORMPropertyValue(0.9)).toThrow(
        new HatchifyCoerceError("greater than or equal to 1"),
      )
      expect(() => setORMPropertyValue(10.1)).toThrow(
        new HatchifyCoerceError("less than or equal to 10"),
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

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("1")).toBe(1)
      expect(setORMQueryFilterValue("1.1")).toBe(1.1)
      expect(setORMQueryFilterValue("1.11")).toBe(1.11)
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("-1")).toThrow(
        new HatchifyCoerceError("greater than or equal to 1"),
      )
      expect(() => setORMQueryFilterValue("0")).toThrow(
        new HatchifyCoerceError("greater than or equal to 1"),
      )
      expect(() => setORMQueryFilterValue("0.9")).toThrow(
        new HatchifyCoerceError("greater than or equal to 1"),
      )
      expect(() => setORMQueryFilterValue("10.1")).toThrow(
        new HatchifyCoerceError("less than or equal to 10"),
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
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'number({"min":1,"max":10})',
        orm: {
          sequelize: {
            type: "DECIMAL",
            typeArgs: [],
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "Number",
          ui: { displayName: null },
          allowNull: true,
          min: 1,
          max: 10,
          primary: false,
          default: null,
          step: 0,
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
