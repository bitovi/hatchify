import { HatchifyCoerceError } from "../../types/index.js"

import { dateonly } from "./index.js"

describe("dateonly", () => {
  describe("dateonly()", () => {
    const type = dateonly()

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: "dateonly()",
        orm: {
          sequelize: {
            type: "DATEONLY",
            typeArgs: [],
            allowNull: undefined,
            primaryKey: undefined,
          },
        },
        control: {
          type: "Dateonly",
          allowNull: undefined,
          min: undefined,
          max: undefined,
          primary: undefined,
          ui: {},
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

      // setClientPropertyValue
      expect(setClientPropertyValue?.("2023-01-01")).toEqual("2023-01-01")
      expect(setClientPropertyValue?.("2023-01-01")).toEqual("2023-01-01")
      expect(setClientPropertyValue?.(null)).toBeNull()
      expect(() => setClientPropertyValue?.(1)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(() => setClientPropertyValue?.("2010-01-")).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )

      // serializeClientPropertyValue
      expect(serializeClientPropertyValue?.("2023-01-01")).toEqual("2023-01-01")
      expect(serializeClientPropertyValue?.(null)).toBeNull()

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.("2023-01-01")).toEqual("2023-01-01")
      expect(setClientQueryFilterValue?.("2023-01-01")).toEqual("2023-01-01")
      expect(setClientQueryFilterValue?.(null)).toBeNull()
      expect(() => setClientQueryFilterValue?.(1)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(() => setClientQueryFilterValue?.("2010-01-0")).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )

      // serializeClientQueryFilterValue
      expect(serializeClientQueryFilterValue?.("2023-01-01")).toEqual(
        "2023-01-01",
      )
      expect(serializeClientQueryFilterValue?.(null)).toEqual("null")

      // setClientPropertyValueFromResponse
      expect(setClientPropertyValueFromResponse?.("2023-01-01")).toEqual(
        "2023-01-01",
      )
      expect(setClientPropertyValueFromResponse?.("2023-01-01")).toEqual(
        "2023-01-01",
      )
      expect(setClientPropertyValueFromResponse?.(null)).toBeNull()
      expect(() => setClientPropertyValueFromResponse?.(1)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(
        () => setClientPropertyValueFromResponse?.("2023-01-01T00:00:00.000Z"),
      ).toThrow(new HatchifyCoerceError("as a 'YYYY-MM-DD' string"))

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue("2023-01-01")).toEqual("2023-01-01")
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() => serializeORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as string),
      ).toThrow(new HatchifyCoerceError("as a 'YYYY-MM-DD' string"))

      // setORMPropertyValue
      expect(setORMPropertyValue("2023-01-01")).toEqual("2023-01-01")
      expect(setORMPropertyValue(null)).toBeNull()
      expect(setORMPropertyValue(undefined)).toBeNull()
      expect(() => setORMPropertyValue(1)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("2023-01-01")).toEqual("2023-01-01")
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: "dateonly()",
        orm: {
          sequelize: {
            type: "DATEONLY",
            typeArgs: [],
            allowNull: true,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "Dateonly",
          ui: {
            hidden: false,
            displayName: null,
          },
          readOnly: false,
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

  describe("dateonly({required: true})", () => {
    const type = dateonly({ required: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'dateonly({"required":true})',
        orm: {
          sequelize: {
            type: "DATEONLY",
            typeArgs: [],
            allowNull: false,
            primaryKey: undefined,
          },
        },
        control: {
          type: "Dateonly",
          allowNull: false,
          allowNullInfer: false,
          min: undefined,
          max: undefined,
          primary: undefined,
          ui: {},
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
      expect(serializeORMPropertyValue("2023-01-01")).toEqual("2023-01-01")
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => serializeORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as string),
      ).toThrow(new HatchifyCoerceError("as a 'YYYY-MM-DD' string"))

      // setORMPropertyValue
      expect(setORMPropertyValue("2023-01-01")).toEqual("2023-01-01")
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMPropertyValue(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
      )
      expect(() => setORMPropertyValue(1)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("2023-01-01")).toEqual("2023-01-01")
      expect(() => setORMQueryFilterValue("null")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("undefined")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'dateonly({"required":true})',
        orm: {
          sequelize: {
            type: "DATEONLY",
            typeArgs: [],
            allowNull: false,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "Dateonly",
          ui: {
            displayName: null,
            hidden: false,
          },
          readOnly: false,
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

  describe("dateonly({primary: true})", () => {
    const type = dateonly({ primary: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'dateonly({"primary":true})',
        orm: {
          sequelize: {
            type: "DATEONLY",
            typeArgs: [],
            allowNull: undefined,
            primaryKey: true,
          },
        },
        control: {
          type: "Dateonly",
          allowNull: undefined,
          min: undefined,
          max: undefined,
          primary: true,
          ui: {},
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

      // setClientPropertyValue
      expect(setClientPropertyValue?.("2023-01-01")).toEqual("2023-01-01")
      expect(setClientPropertyValue?.("2023-01-01")).toEqual("2023-01-01")
      expect(() => setClientPropertyValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientPropertyValue?.(1)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(() => setClientPropertyValue?.("2010-01-")).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )

      // serializeClientPropertyValue
      expect(serializeClientPropertyValue?.("2023-01-01")).toEqual("2023-01-01")
      expect(() => setClientPropertyValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.("2023-01-01")).toEqual("2023-01-01")
      expect(setClientQueryFilterValue?.("2023-01-01")).toEqual("2023-01-01")
      expect(() => setClientQueryFilterValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientQueryFilterValue?.(1)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(() => setClientQueryFilterValue?.("2010-01-0")).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )

      // serializeClientQueryFilterValue
      expect(serializeClientQueryFilterValue?.("2023-01-01")).toEqual(
        "2023-01-01",
      )
      expect(() => serializeClientQueryFilterValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )

      // setClientPropertyValueFromResponse
      expect(setClientPropertyValueFromResponse?.("2023-01-01")).toEqual(
        "2023-01-01",
      )
      expect(setClientPropertyValueFromResponse?.("2023-01-01")).toEqual(
        "2023-01-01",
      )
      expect(() => setClientPropertyValueFromResponse?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientPropertyValueFromResponse?.(1)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(
        () => setClientPropertyValueFromResponse?.("2023-01-01T00:00:00.000Z"),
      ).toThrow(new HatchifyCoerceError("as a 'YYYY-MM-DD' string"))

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue("2023-01-01")).toEqual("2023-01-01")
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => serializeORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as string),
      ).toThrow(new HatchifyCoerceError("as a 'YYYY-MM-DD' string"))

      // setORMPropertyValue
      expect(setORMPropertyValue("2023-01-01")).toEqual("2023-01-01")
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMPropertyValue(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
      )
      expect(() => setORMPropertyValue(1)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("2023-01-01")).toEqual("2023-01-01")
      expect(() => setORMQueryFilterValue("null")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("undefined")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'dateonly({"primary":true})',
        orm: {
          sequelize: {
            type: "DATEONLY",
            typeArgs: [],
            allowNull: false,
            primaryKey: true,
            unique: true,
            defaultValue: null,
          },
        },
        control: {
          type: "Dateonly",
          ui: {
            displayName: null,
            hidden: false,
          },
          readOnly: false,
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

  describe("dateonly({step: 'day'})", () => {
    const type = dateonly({ step: "day" })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'dateonly({"step":"day"})',
        orm: {
          sequelize: {
            type: "DATEONLY",
            typeArgs: [],
            allowNull: undefined,
            primaryKey: undefined,
          },
        },
        control: {
          type: "Dateonly",
          allowNull: undefined,
          min: undefined,
          max: undefined,
          primary: undefined,
          step: "day",
          ui: {},
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

      // setClientPropertyValue
      expect(setClientPropertyValue?.("2023-01-01")).toEqual("2023-01-01")
      expect(setClientPropertyValue?.("2023-01-01")).toEqual("2023-01-01")
      expect(setClientPropertyValue?.(null)).toBeNull()
      expect(() => setClientPropertyValue?.(1)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(() => setClientPropertyValue?.("2010-01-01 12:12:12")).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )

      // serializeClientPropertyValue
      expect(serializeClientPropertyValue?.("2023-01-01")).toEqual("2023-01-01")
      expect(serializeClientPropertyValue?.(null)).toBeNull()

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.("2023-01-01")).toEqual("2023-01-01")
      expect(setClientQueryFilterValue?.("2023-01-01")).toEqual("2023-01-01")
      expect(setClientQueryFilterValue?.(null)).toBeNull()
      expect(() => setClientQueryFilterValue?.(1)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(() => setClientQueryFilterValue?.("2010-01-01 12:12:12")).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )

      // serializeClientQueryFilterValue
      expect(serializeClientQueryFilterValue?.("2023-01-01")).toEqual(
        "2023-01-01",
      )
      expect(serializeClientQueryFilterValue?.(null)).toEqual("null")

      // setClientPropertyValueFromResponse
      expect(setClientPropertyValueFromResponse?.("2023-01-01")).toEqual(
        "2023-01-01",
      )
      expect(setClientPropertyValueFromResponse?.("2023-01-01")).toEqual(
        "2023-01-01",
      )
      expect(setClientPropertyValueFromResponse?.(null)).toBeNull()
      expect(() => setClientPropertyValueFromResponse?.(1)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(
        () => setClientPropertyValueFromResponse?.("2010-01-01 12:12:12"),
      ).toThrow(new HatchifyCoerceError("as a 'YYYY-MM-DD' string"))

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue("2023-01-01")).toEqual("2023-01-01")
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() => serializeORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as string),
      ).toThrow(new HatchifyCoerceError("as a 'YYYY-MM-DD' string"))

      // setORMPropertyValue
      expect(setORMPropertyValue("2023-01-01")).toEqual("2023-01-01")
      expect(setORMPropertyValue(null)).toBeNull()
      expect(setORMPropertyValue(undefined)).toBeNull()
      expect(() => setORMPropertyValue(1)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("2023-01-01")).toEqual("2023-01-01")
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'dateonly({"step":"day"})',
        orm: {
          sequelize: {
            type: "DATEONLY",
            typeArgs: [],
            allowNull: true,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "Dateonly",
          allowNull: true,
          ui: {
            displayName: null,
            hidden: false,
          },
          readOnly: false,
          min: -Infinity,
          max: Infinity,
          primary: false,
          default: null,
          step: "day",
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

  describe("dateonly({min: -Infinity, max: '2023-01-01'})", () => {
    const type = dateonly({
      min: -Infinity,
      max: "2023-01-01",
    })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'dateonly({"min":null,"max":"2023-01-01"})',
        orm: {
          sequelize: {
            type: "DATEONLY",
            typeArgs: [],
            allowNull: undefined,
            primaryKey: undefined,
          },
        },
        control: {
          type: "Dateonly",
          allowNull: undefined,
          min: -Infinity,
          max: "2023-01-01",
          primary: undefined,
          ui: {},
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
      expect(serializeORMPropertyValue("2023-01-01")).toEqual("2023-01-01")
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() => serializeORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as string),
      ).toThrow(new HatchifyCoerceError("as a 'YYYY-MM-DD' string"))
      expect(() => serializeORMPropertyValue("2023-01-02")).toThrow(
        new HatchifyCoerceError("before or on 2023-01-01"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue("2023-01-01")).toEqual("2023-01-01")
      expect(setORMPropertyValue(null)).toBeNull()
      expect(setORMPropertyValue(undefined)).toBeNull()
      expect(() => setORMPropertyValue(1)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(() => setORMPropertyValue("2023-01-02")).toThrow(
        new HatchifyCoerceError("before or on 2023-01-01"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("2023-01-01")).toEqual("2023-01-01")
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(() => setORMQueryFilterValue("2023-01-02")).toThrow(
        new HatchifyCoerceError("before or on 2023-01-01"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'dateonly({"min":null,"max":"2023-01-01"})',
        orm: {
          sequelize: {
            type: "DATEONLY",
            typeArgs: [],
            allowNull: true,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "Dateonly",
          ui: {
            displayName: null,
            hidden: false,
          },
          readOnly: false,
          allowNull: true,
          min: -Infinity,
          max: "2023-01-01",
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

  describe("dateonly({readOnly: true})", () => {
    const type = dateonly({ readOnly: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'dateonly({"readOnly":true})',
        orm: {
          sequelize: {
            type: "DATEONLY",
            typeArgs: [],
            allowNull: undefined,
            primaryKey: undefined,
          },
        },
        control: {
          type: "Dateonly",
          allowNull: undefined,
          min: undefined,
          max: undefined,
          primary: undefined,
          readOnly: true,
          ui: {
            displayName: undefined,
            hidden: undefined,
          },
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

      // setClientPropertyValue
      expect(setClientPropertyValue?.("2023-01-01")).toEqual("2023-01-01")
      expect(setClientPropertyValue?.("2023-01-01")).toEqual("2023-01-01")
      expect(setClientPropertyValue?.(null)).toBeNull()
      expect(() => setClientPropertyValue?.(1)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(() => setClientPropertyValue?.("2010-01-")).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )

      // serializeClientPropertyValue
      expect(serializeClientPropertyValue?.("2023-01-01")).toEqual("2023-01-01")
      expect(serializeClientPropertyValue?.(null)).toBeNull()

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.("2023-01-01")).toEqual("2023-01-01")
      expect(setClientQueryFilterValue?.("2023-01-01")).toEqual("2023-01-01")
      expect(setClientQueryFilterValue?.(null)).toBeNull()
      expect(() => setClientQueryFilterValue?.(1)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(() => setClientQueryFilterValue?.("2010-01-0")).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )

      // serializeClientQueryFilterValue
      expect(serializeClientQueryFilterValue?.("2023-01-01")).toEqual(
        "2023-01-01",
      )
      expect(serializeClientQueryFilterValue?.(null)).toEqual("null")

      // setClientPropertyValueFromResponse
      expect(setClientPropertyValueFromResponse?.("2023-01-01")).toEqual(
        "2023-01-01",
      )
      expect(setClientPropertyValueFromResponse?.("2023-01-01")).toEqual(
        "2023-01-01",
      )
      expect(setClientPropertyValueFromResponse?.(null)).toBeNull()
      expect(() => setClientPropertyValueFromResponse?.(1)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(
        () => setClientPropertyValueFromResponse?.("2023-01-01T00:00:00.000Z"),
      ).toThrow(new HatchifyCoerceError("as a 'YYYY-MM-DD' string"))

      // serializeORMPropertyValue
      expect(serializeORMPropertyValue("2023-01-01")).toEqual("2023-01-01")
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() => serializeORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as string),
      ).toThrow(new HatchifyCoerceError("as a 'YYYY-MM-DD' string"))

      // setORMPropertyValue
      expect(() => setORMPropertyValue("2023-01-01")).toThrow(
        new HatchifyCoerceError("as a read-only value"),
      )
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a read-only value"),
      )
      expect(() => setORMPropertyValue(undefined)).toThrow(
        new HatchifyCoerceError("as a read-only value"),
      )
      expect(() => setORMPropertyValue(1)).toThrow(
        new HatchifyCoerceError("as a read-only value"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as a read-only value"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("2023-01-01")).toEqual("2023-01-01")
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as a 'YYYY-MM-DD' string"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'dateonly({"readOnly":true})',
        orm: {
          sequelize: {
            type: "DATEONLY",
            typeArgs: [],
            allowNull: true,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "Dateonly",
          readOnly: true,
          allowNull: true,
          min: -Infinity,
          max: Infinity,
          primary: false,
          default: null,
          step: 0,
          ui: {
            displayName: null,
            hidden: false,
          },
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
