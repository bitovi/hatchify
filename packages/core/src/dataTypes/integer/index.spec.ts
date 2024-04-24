import { HatchifyCoerceError } from "../../types/index.js"

import { integer } from "./index.js"

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
          allowNullInfer: undefined,
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
      expect(() => setClientPropertyValue?.(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

      // serializeClientPropertyValue
      expect(serializeClientPropertyValue?.(-1)).toBe(-1)
      expect(serializeClientPropertyValue?.(0)).toBe(0)
      expect(serializeClientPropertyValue?.(1)).toBe(1)
      // This function expects valid data, so it won't throw an error.
      expect(serializeClientPropertyValue?.(null)).toBeNull()
      expect(serializeClientPropertyValue?.(1.1)).toBe(1.1)
      expect(
        serializeClientPropertyValue?.("invalid" as unknown as number),
      ).toBe("invalid")

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.(-1)).toBe(-1)
      expect(setClientQueryFilterValue?.(0)).toBe(0)
      expect(setClientQueryFilterValue?.(1)).toBe(1)
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
      expect(() => setClientQueryFilterValue?.(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

      // serializeClientQueryFilterValue
      expect(serializeClientQueryFilterValue?.(-1)).toBe("-1")
      expect(serializeClientQueryFilterValue?.(0)).toBe("0")
      expect(serializeClientQueryFilterValue?.(1)).toBe("1")
      // This function expects valid data, so it won't throw an error.
      expect(serializeClientQueryFilterValue?.(null)).toBe("null")
      expect(
        serializeClientQueryFilterValue?.("invalid" as unknown as number),
      ).toBe('"invalid"')

      // setClientPropertyValueFromResponse
      expect(setClientPropertyValueFromResponse?.(-1)).toBe(-1)
      expect(setClientPropertyValueFromResponse?.(0)).toBe(0)
      expect(setClientPropertyValueFromResponse?.(1)).toBe(1)
      expect(setClientPropertyValueFromResponse?.("1")).toBe(1)
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
      expect(() => setClientPropertyValueFromResponse?.(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

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
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "Number",
          displayName: null,
          hidden: false,
          readOnly: false,
          allowNull: true,
          min: -Infinity,
          max: Infinity,
          primary: false,
          default: null,
          step: 1,
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
          allowNullInfer: false,
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
      expect(() => setClientPropertyValue?.(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

      // serializeClientPropertyValue
      expect(serializeClientPropertyValue?.(-1)).toBe(-1)
      expect(serializeClientPropertyValue?.(0)).toBe(0)
      expect(serializeClientPropertyValue?.(1)).toBe(1)
      // This function expects valid data, so it won't throw an error.
      expect(serializeClientPropertyValue?.(null)).toBeNull()
      expect(serializeClientPropertyValue?.(1.1)).toBe(1.1)
      expect(
        serializeClientPropertyValue?.("invalid" as unknown as number),
      ).toBe("invalid")

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.(-1)).toBe(-1)
      expect(setClientQueryFilterValue?.(-1)).toBe(-1)
      expect(setClientQueryFilterValue?.(0)).toBe(0)
      expect(setClientQueryFilterValue?.(1)).toBe(1)
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
      expect(() => setClientQueryFilterValue?.(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

      // serializeClientQueryFilterValue
      expect(serializeClientQueryFilterValue?.(-1)).toBe("-1")
      expect(serializeClientQueryFilterValue?.(0)).toBe("0")
      expect(serializeClientQueryFilterValue?.(1)).toBe("1")
      // This function expects valid data, so it won't throw an error.
      expect(serializeClientQueryFilterValue?.(null)).toBe("null")
      expect(
        serializeClientQueryFilterValue?.("invalid" as unknown as number),
      ).toBe('"invalid"')

      // setClientPropertyValueFromResponse
      expect(setClientPropertyValueFromResponse?.(-1)).toBe(-1)
      expect(setClientPropertyValueFromResponse?.(0)).toBe(0)
      expect(setClientPropertyValueFromResponse?.(1)).toBe(1)
      expect(setClientPropertyValueFromResponse?.("1")).toBe(1)
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
      expect(() => setClientPropertyValueFromResponse?.(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

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
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "Number",
          displayName: null,
          hidden: false,
          readOnly: false,
          allowNull: false,
          min: -Infinity,
          max: Infinity,
          primary: false,
          default: null,
          step: 1,
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
      expect(() => setClientPropertyValue?.(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

      // serializeClientPropertyValue
      expect(serializeClientPropertyValue?.(-1)).toBe(-1)
      expect(serializeClientPropertyValue?.(0)).toBe(0)
      expect(serializeClientPropertyValue?.(1)).toBe(1)
      // This function expects valid data, so it won't throw an error.
      expect(serializeClientPropertyValue?.(null)).toBeNull()
      expect(serializeClientPropertyValue?.(1.1)).toBe(1.1)
      expect(
        serializeClientPropertyValue?.("invalid" as unknown as number),
      ).toBe("invalid")

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.(-1)).toBe(-1)
      expect(setClientQueryFilterValue?.(0)).toBe(0)
      expect(setClientQueryFilterValue?.(1)).toBe(1)
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
      expect(() => setClientQueryFilterValue?.(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

      // serializeClientQueryFilterValue
      expect(serializeClientQueryFilterValue?.(-1)).toBe("-1")
      expect(serializeClientQueryFilterValue?.(0)).toBe("0")
      expect(serializeClientQueryFilterValue?.(1)).toBe("1")
      // This function expects valid data, so it won't throw an error.
      expect(serializeClientQueryFilterValue?.(null)).toBe("null")
      expect(
        serializeClientQueryFilterValue?.("invalid" as unknown as number),
      ).toBe('"invalid"')

      // setClientPropertyValueFromResponse
      expect(setClientPropertyValueFromResponse?.(-1)).toBe(-1)
      expect(setClientPropertyValueFromResponse?.(0)).toBe(0)
      expect(setClientPropertyValueFromResponse?.(1)).toBe(1)
      expect(setClientPropertyValueFromResponse?.("1")).toBe(1)
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
      expect(() => setClientPropertyValueFromResponse?.(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

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
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "Number",
          displayName: null,
          hidden: false,
          readOnly: false,
          allowNull: true,
          min: -Infinity,
          max: Infinity,
          primary: false,
          default: null,
          step: 1,
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
      expect(() => setClientPropertyValue?.(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

      // serializeClientPropertyValue
      expect(serializeClientPropertyValue?.(-1)).toBe(-1)
      expect(serializeClientPropertyValue?.(0)).toBe(0)
      expect(serializeClientPropertyValue?.(1)).toBe(1)
      // This function expects valid data, so it won't throw an error.
      expect(serializeClientPropertyValue?.(null)).toBeNull()
      expect(serializeClientPropertyValue?.(1.1)).toBe(1.1)
      expect(
        serializeClientPropertyValue?.("invalid" as unknown as number),
      ).toBe("invalid")

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.(-1)).toBe(-1)
      expect(setClientQueryFilterValue?.(0)).toBe(0)
      expect(setClientQueryFilterValue?.(1)).toBe(1)
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
      expect(() => setClientQueryFilterValue?.(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

      // serializeClientQueryFilterValue
      expect(serializeClientQueryFilterValue?.(-1)).toBe("-1")
      expect(serializeClientQueryFilterValue?.(0)).toBe("0")
      expect(serializeClientQueryFilterValue?.(1)).toBe("1")
      // This function expects valid data, so it won't throw an error.
      expect(serializeClientQueryFilterValue?.(null)).toBe("null")
      expect(
        serializeClientQueryFilterValue?.("invalid" as unknown as number),
      ).toBe('"invalid"')

      // setClientPropertyValueFromResponse
      expect(setClientPropertyValueFromResponse?.(-1)).toBe(-1)
      expect(setClientPropertyValueFromResponse?.(0)).toBe(0)
      expect(setClientPropertyValueFromResponse?.(1)).toBe(1)
      expect(setClientPropertyValueFromResponse?.("1")).toBe(1)
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
      expect(() => setClientPropertyValueFromResponse?.(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

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
            unique: true,
            defaultValue: null,
          },
        },
        control: {
          type: "Number",
          displayName: null,
          hidden: false,
          readOnly: false,
          allowNull: false,
          min: -Infinity,
          max: Infinity,
          primary: true,
          default: null,
          step: 1,
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

  describe("integer({readOnly: true})", () => {
    const type = integer({ readOnly: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'integer({"readOnly":true})',
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
          allowNullInfer: undefined,
          min: undefined,
          max: undefined,
          primary: undefined,
          step: 1,
          readOnly: true,
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
      expect(() => setClientPropertyValue?.(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

      // serializeClientPropertyValue
      expect(serializeClientPropertyValue?.(-1)).toBe(-1)
      expect(serializeClientPropertyValue?.(0)).toBe(0)
      expect(serializeClientPropertyValue?.(1)).toBe(1)
      // This function expects valid data, so it won't throw an error.
      expect(serializeClientPropertyValue?.(null)).toBeNull()
      expect(serializeClientPropertyValue?.(1.1)).toBe(1.1)
      expect(
        serializeClientPropertyValue?.("invalid" as unknown as number),
      ).toBe("invalid")

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.(-1)).toBe(-1)
      expect(setClientQueryFilterValue?.(0)).toBe(0)
      expect(setClientQueryFilterValue?.(1)).toBe(1)
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
      expect(() => setClientQueryFilterValue?.(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

      // serializeClientQueryFilterValue
      expect(serializeClientQueryFilterValue?.(-1)).toBe("-1")
      expect(serializeClientQueryFilterValue?.(0)).toBe("0")
      expect(serializeClientQueryFilterValue?.(1)).toBe("1")
      // This function expects valid data, so it won't throw an error.
      expect(serializeClientQueryFilterValue?.(null)).toBe("null")
      expect(
        serializeClientQueryFilterValue?.("invalid" as unknown as number),
      ).toBe('"invalid"')

      // setClientPropertyValueFromResponse
      expect(setClientPropertyValueFromResponse?.(-1)).toBe(-1)
      expect(setClientPropertyValueFromResponse?.(0)).toBe(0)
      expect(setClientPropertyValueFromResponse?.(1)).toBe(1)
      expect(setClientPropertyValueFromResponse?.("1")).toBe(1)
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
      expect(() => setClientPropertyValueFromResponse?.(1.1)).toThrow(
        new HatchifyCoerceError("as multiples of 1"),
      )

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
      expect(() => setORMPropertyValue(-1)).toThrow(
        new HatchifyCoerceError("as a read-only value"),
      )
      expect(() => setORMPropertyValue(0)).toThrow(
        new HatchifyCoerceError("as a read-only value"),
      )
      expect(() => setORMPropertyValue(1)).toThrow(
        new HatchifyCoerceError("as a read-only value"),
      )
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a read-only value"),
      )
      expect(() => setORMPropertyValue(undefined)).toThrow(
        new HatchifyCoerceError("as a read-only value"),
      )
      expect(() => setORMPropertyValue("invalid" as unknown as number)).toThrow(
        new HatchifyCoerceError("as a read-only value"),
      )
      expect(() => setORMPropertyValue(-Infinity)).toThrow(
        new HatchifyCoerceError("as a read-only value"),
      )
      expect(() => setORMPropertyValue(Infinity)).toThrow(
        new HatchifyCoerceError("as a read-only value"),
      )
      expect(() => setORMPropertyValue(1.1)).toThrow(
        new HatchifyCoerceError("as a read-only value"),
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
        name: 'integer({"readOnly":true})',
        orm: {
          sequelize: {
            type: "INTEGER",
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
          displayName: null,
          hidden: false,
          readOnly: true,
          allowNull: true,
          min: -Infinity,
          max: Infinity,
          primary: false,
          default: null,
          step: 1,
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
