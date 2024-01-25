import { HatchifyCoerceError } from "../../types/index.js"

import { datetime } from "./index.js"

describe("datetime", () => {
  describe("datetime()", () => {
    const type = datetime()

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: "datetime()",
        orm: {
          sequelize: {
            type: "DATE",
            typeArgs: [],
            allowNull: undefined,
            primaryKey: undefined,
          },
        },
        control: {
          type: "Datetime",
          allowNull: undefined,
          min: undefined,
          max: undefined,
          primary: undefined,
          step: undefined,
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
      expect(setClientPropertyValue?.("2023-01-01T00:00:00.000Z")).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(
        setClientPropertyValue?.(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(setClientPropertyValue?.(null)).toBeNull()
      expect(() => setClientPropertyValue?.(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() => setClientPropertyValue?.("2010-01-01 12:12:12")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )

      // serializeClientPropertyValue
      expect(
        serializeClientPropertyValue?.(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual("2023-01-01T00:00:00.000Z")
      expect(serializeClientPropertyValue?.(null)).toBeNull()

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.("2023-01-01T00:00:00.000Z")).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(
        setClientQueryFilterValue?.(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(setClientQueryFilterValue?.(null)).toBeNull()
      expect(() => setClientQueryFilterValue?.(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() => setClientQueryFilterValue?.("2010-01-01 12:12:12")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )

      // serializeClientQueryFilterValue
      expect(
        serializeClientQueryFilterValue?.(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual("2023-01-01T00:00:00.000Z")
      expect(serializeClientQueryFilterValue?.(null)).toEqual("null")

      // setClientPropertyValueFromResponse
      expect(
        setClientPropertyValueFromResponse?.("2023-01-01T00:00:00.000Z"),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(
        setClientPropertyValueFromResponse?.(
          new Date("2023-01-01T00:00:00.000Z"),
        ),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(setClientPropertyValueFromResponse?.(null)).toBeNull()
      expect(() => setClientPropertyValueFromResponse?.(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(
        () => setClientPropertyValueFromResponse?.("2010-01-01 12:12:12"),
      ).toThrow(new HatchifyCoerceError("as an ISO 8601 date and time string"))

      // serializeORMPropertyValue
      expect(
        serializeORMPropertyValue(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() => serializeORMPropertyValue(1 as unknown as Date)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as Date),
      ).toThrow(new HatchifyCoerceError("as an ISO 8601 date and time string"))

      // setORMPropertyValue
      expect(setORMPropertyValue(new Date("2023-01-01T00:00:00.000Z"))).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(setORMPropertyValue(null)).toBeNull()
      expect(setORMPropertyValue(undefined)).toBeNull()
      expect(() => setORMPropertyValue(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("2023-01-01T00:00:00.000Z")).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: "datetime()",
        orm: {
          sequelize: {
            type: "DATE",
            typeArgs: [],
            allowNull: true,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "Datetime",
          displayName: null,
          hidden: false,
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

  describe("datetime({required: true})", () => {
    const type = datetime({ required: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'datetime({"required":true})',
        orm: {
          sequelize: {
            type: "DATE",
            typeArgs: [],
            allowNull: false,
            primaryKey: undefined,
          },
        },
        control: {
          type: "Datetime",
          allowNull: false,
          allowNullInfer: false,
          min: undefined,
          max: undefined,
          primary: undefined,
          step: undefined,
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
      expect(setClientPropertyValue?.("2023-01-01T00:00:00.000Z")).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(
        setClientPropertyValue?.(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(() => setClientPropertyValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientPropertyValue?.(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() => setClientPropertyValue?.("2010-01-01 12:12:12")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )

      // serializeClientPropertyValue
      expect(
        serializeClientPropertyValue?.(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual("2023-01-01T00:00:00.000Z")
      expect(() => serializeClientPropertyValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.("2023-01-01T00:00:00.000Z")).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(
        setClientQueryFilterValue?.(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(() => setClientQueryFilterValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientQueryFilterValue?.(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() => setClientQueryFilterValue?.("2010-01-01 12:12:12")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )

      // serializeClientQueryFilterValue
      expect(
        serializeClientQueryFilterValue?.(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual("2023-01-01T00:00:00.000Z")
      expect(() => serializeClientQueryFilterValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )

      // setClientPropertyValueFromResponse
      expect(
        setClientPropertyValueFromResponse?.("2023-01-01T00:00:00.000Z"),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(
        setClientPropertyValueFromResponse?.(
          new Date("2023-01-01T00:00:00.000Z"),
        ),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(() => setClientPropertyValueFromResponse?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientPropertyValueFromResponse?.(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(
        () => setClientPropertyValueFromResponse?.("2010-01-01 12:12:12"),
      ).toThrow(new HatchifyCoerceError("as an ISO 8601 date and time string"))

      // serializeORMPropertyValue
      expect(
        serializeORMPropertyValue(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => serializeORMPropertyValue(1 as unknown as Date)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as Date),
      ).toThrow(new HatchifyCoerceError("as an ISO 8601 date and time string"))

      // setORMPropertyValue
      expect(setORMPropertyValue(new Date("2023-01-01T00:00:00.000Z"))).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMPropertyValue(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
      )
      expect(() => setORMPropertyValue(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("2023-01-01T00:00:00.000Z")).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(() => setORMQueryFilterValue("null")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("undefined")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'datetime({"required":true})',
        orm: {
          sequelize: {
            type: "DATE",
            typeArgs: [],
            allowNull: false,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "Datetime",
          displayName: null,
          hidden: false,
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

  describe("datetime({primary: true})", () => {
    const type = datetime({ primary: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'datetime({"primary":true})',
        orm: {
          sequelize: {
            type: "DATE",
            typeArgs: [],
            allowNull: undefined,
            primaryKey: true,
          },
        },
        control: {
          type: "Datetime",
          allowNull: undefined,
          min: undefined,
          max: undefined,
          primary: true,
          step: undefined,
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
      expect(setClientPropertyValue?.("2023-01-01T00:00:00.000Z")).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(
        setClientPropertyValue?.(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(() => setClientPropertyValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientPropertyValue?.(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() => setClientPropertyValue?.("2010-01-01 12:12:12")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )

      // serializeClientPropertyValue
      expect(
        serializeClientPropertyValue?.(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual("2023-01-01T00:00:00.000Z")
      expect(() => serializeClientPropertyValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.("2023-01-01T00:00:00.000Z")).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(
        setClientQueryFilterValue?.(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(() => setClientQueryFilterValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientQueryFilterValue?.(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() => setClientQueryFilterValue?.("2010-01-01 12:12:12")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )

      // serializeClientQueryFilterValue
      expect(
        serializeClientQueryFilterValue?.(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual("2023-01-01T00:00:00.000Z")
      expect(() => serializeClientQueryFilterValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )

      // setClientPropertyValueFromResponse
      expect(
        setClientPropertyValueFromResponse?.("2023-01-01T00:00:00.000Z"),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(
        setClientPropertyValueFromResponse?.(
          new Date("2023-01-01T00:00:00.000Z"),
        ),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(() => setClientPropertyValueFromResponse?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientPropertyValueFromResponse?.(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(
        () => setClientPropertyValueFromResponse?.("2010-01-01 12:12:12"),
      ).toThrow(new HatchifyCoerceError("as an ISO 8601 date and time string"))

      // serializeORMPropertyValue
      expect(
        serializeORMPropertyValue(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => serializeORMPropertyValue(1 as unknown as Date)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as Date),
      ).toThrow(new HatchifyCoerceError("as an ISO 8601 date and time string"))

      // setORMPropertyValue
      expect(setORMPropertyValue(new Date("2023-01-01T00:00:00.000Z"))).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMPropertyValue(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
      )
      expect(() => setORMPropertyValue(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("2023-01-01T00:00:00.000Z")).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(() => setORMQueryFilterValue("null")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("undefined")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'datetime({"primary":true})',
        orm: {
          sequelize: {
            type: "DATE",
            typeArgs: [],
            allowNull: false,
            primaryKey: true,
            unique: true,
            defaultValue: null,
          },
        },
        control: {
          type: "Datetime",
          displayName: null,
          hidden: false,
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

  describe("datetime({step: 'day'})", () => {
    const type = datetime({ step: "day" })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'datetime({"step":"day"})',
        orm: {
          sequelize: {
            type: "DATE",
            typeArgs: [],
            allowNull: undefined,
            primaryKey: undefined,
          },
        },
        control: {
          type: "Datetime",
          allowNull: undefined,
          min: undefined,
          max: undefined,
          primary: undefined,
          step: "day",
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
      expect(setClientPropertyValue?.("2023-01-01T00:00:00.000Z")).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(
        setClientPropertyValue?.(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(setClientPropertyValue?.(null)).toBeNull()
      expect(() => setClientPropertyValue?.(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() => setClientPropertyValue?.("2010-01-01 12:12:12")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(
        () => setClientPropertyValue?.(new Date("2024-01-01T01:00:00.000Z")),
      ).toThrow(new HatchifyCoerceError("as multiples of day"))

      // serializeClientPropertyValue
      expect(
        serializeClientPropertyValue?.(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual("2023-01-01T00:00:00.000Z")
      expect(serializeClientPropertyValue?.(null)).toBeNull()
      expect(
        () =>
          serializeClientPropertyValue?.(new Date("2024-01-01T01:00:00.000Z")),
      ).toThrow(new HatchifyCoerceError("as multiples of day"))

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.("2023-01-01T00:00:00.000Z")).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(
        setClientQueryFilterValue?.(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(setClientQueryFilterValue?.(null)).toBeNull()
      expect(() => setClientQueryFilterValue?.(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() => setClientQueryFilterValue?.("2010-01-01 12:12:12")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(
        () => setClientQueryFilterValue?.(new Date("2024-01-01T01:00:00.000Z")),
      ).toThrow(new HatchifyCoerceError("as multiples of day"))

      // serializeClientQueryFilterValue
      expect(
        serializeClientQueryFilterValue?.(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual("2023-01-01T00:00:00.000Z")
      expect(serializeClientQueryFilterValue?.(null)).toEqual("null")
      expect(
        () =>
          serializeClientQueryFilterValue?.(
            new Date("2024-01-01T010:00:00.000Z"),
          ),
      ).toThrow(new HatchifyCoerceError("as multiples of day"))

      // setClientPropertyValueFromResponse
      expect(
        setClientPropertyValueFromResponse?.("2023-01-01T00:00:00.000Z"),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(
        setClientPropertyValueFromResponse?.(
          new Date("2023-01-01T00:00:00.000Z"),
        ),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(setClientPropertyValueFromResponse?.(null)).toBeNull()
      expect(() => setClientPropertyValueFromResponse?.(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(
        () => setClientPropertyValueFromResponse?.("2010-01-01 12:12:12"),
      ).toThrow(new HatchifyCoerceError("as an ISO 8601 date and time string"))
      expect(
        () =>
          setClientPropertyValueFromResponse?.(
            new Date("2024-01-01T01:00:00.000Z"),
          ),
      ).toThrow(new HatchifyCoerceError("as multiples of day"))

      // serializeORMPropertyValue
      expect(
        serializeORMPropertyValue(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() => serializeORMPropertyValue(1 as unknown as Date)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as Date),
      ).toThrow(new HatchifyCoerceError("as an ISO 8601 date and time string"))
      expect(() =>
        serializeORMPropertyValue(new Date("2023-01-01T01:00:00.000Z")),
      ).toThrow(new HatchifyCoerceError("as multiples of day"))

      // setORMPropertyValue
      expect(setORMPropertyValue(new Date("2023-01-01T00:00:00.000Z"))).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(setORMPropertyValue(null)).toBeNull()
      expect(setORMPropertyValue(undefined)).toBeNull()
      expect(() => setORMPropertyValue(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() =>
        setORMPropertyValue(new Date("2023-01-01T01:00:00.000Z")),
      ).toThrow(new HatchifyCoerceError("as multiples of day"))

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("2023-01-01T00:00:00.000Z")).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() => setORMQueryFilterValue("2023-01-01T01:00:00.000Z")).toThrow(
        new HatchifyCoerceError("as multiples of day"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'datetime({"step":"day"})',
        orm: {
          sequelize: {
            type: "DATE",
            typeArgs: [],
            allowNull: true,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "Datetime",
          allowNull: true,
          displayName: null,
          hidden: false,
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

  describe("datetime({min: -Infinity, max: new Date('2023-01-01T00:00:00.000Z')})", () => {
    const type = datetime({
      min: -Infinity,
      max: new Date("2023-01-01T00:00:00.000Z"),
    })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'datetime({"min":null,"max":"2023-01-01T00:00:00.000Z"})',
        orm: {
          sequelize: {
            type: "DATE",
            typeArgs: [],
            allowNull: undefined,
            primaryKey: undefined,
          },
        },
        control: {
          type: "Datetime",
          allowNull: undefined,
          min: -Infinity,
          max: new Date("2023-01-01T00:00:00.000Z"),
          primary: undefined,
          step: undefined,
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
      expect(setClientPropertyValue?.("2023-01-01T00:00:00.000Z")).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(
        setClientPropertyValue?.(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(setClientPropertyValue?.(null)).toBeNull()
      expect(() => setClientPropertyValue?.(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() => setClientPropertyValue?.("2010-01-01 12:12:12")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(
        () => setClientPropertyValue?.(new Date("2024-01-01T00:00:00.000Z")),
      ).toThrow(
        new HatchifyCoerceError("before or on 2023-01-01T00:00:00.000Z"),
      )

      // serializeClientPropertyValue
      expect(
        serializeClientPropertyValue?.(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual("2023-01-01T00:00:00.000Z")
      expect(serializeClientPropertyValue?.(null)).toBeNull()
      expect(
        () =>
          serializeClientPropertyValue?.(new Date("2024-01-01T00:00:00.000Z")),
      ).toThrow(
        new HatchifyCoerceError("before or on 2023-01-01T00:00:00.000Z"),
      )

      // setClientQueryFilterValue
      expect(setClientQueryFilterValue?.("2023-01-01T00:00:00.000Z")).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(
        setClientQueryFilterValue?.(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(setClientQueryFilterValue?.(null)).toBeNull()
      expect(() => setClientQueryFilterValue?.(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() => setClientQueryFilterValue?.("2010-01-01 12:12:12")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(
        () => setClientQueryFilterValue?.(new Date("2024-01-01T00:00:00.000Z")),
      ).toThrow(
        new HatchifyCoerceError("before or on 2023-01-01T00:00:00.000Z"),
      )

      // serializeClientQueryFilterValue
      expect(
        serializeClientQueryFilterValue?.(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual("2023-01-01T00:00:00.000Z")
      expect(serializeClientQueryFilterValue?.(null)).toEqual("null")
      expect(
        () =>
          serializeClientQueryFilterValue?.(
            new Date("2024-01-01T00:00:00.000Z"),
          ),
      ).toThrow(
        new HatchifyCoerceError("before or on 2023-01-01T00:00:00.000Z"),
      )

      // setClientPropertyValueFromResponse
      expect(
        setClientPropertyValueFromResponse?.("2023-01-01T00:00:00.000Z"),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(
        setClientPropertyValueFromResponse?.(
          new Date("2023-01-01T00:00:00.000Z"),
        ),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(setClientPropertyValueFromResponse?.(null)).toBeNull()
      expect(() => setClientPropertyValueFromResponse?.(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(
        () => setClientPropertyValueFromResponse?.("2010-01-01 12:12:12"),
      ).toThrow(new HatchifyCoerceError("as an ISO 8601 date and time string"))
      expect(
        () =>
          setClientPropertyValueFromResponse?.(
            new Date("2024-01-01T00:00:00.000Z"),
          ),
      ).toThrow(
        new HatchifyCoerceError("before or on 2023-01-01T00:00:00.000Z"),
      )

      // serializeORMPropertyValue
      expect(
        serializeORMPropertyValue(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() => serializeORMPropertyValue(1 as unknown as Date)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as Date),
      ).toThrow(new HatchifyCoerceError("as an ISO 8601 date and time string"))
      expect(() =>
        serializeORMPropertyValue(new Date("2023-01-01T01:00:00.000Z")),
      ).toThrow(
        new HatchifyCoerceError("before or on 2023-01-01T00:00:00.000Z"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue(new Date("2023-01-01T00:00:00.000Z"))).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(setORMPropertyValue(null)).toBeNull()
      expect(setORMPropertyValue(undefined)).toBeNull()
      expect(() => setORMPropertyValue(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() =>
        setORMPropertyValue(new Date("2023-01-01T01:00:00.000Z")),
      ).toThrow(
        new HatchifyCoerceError("before or on 2023-01-01T00:00:00.000Z"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("2023-01-01T00:00:00.000Z")).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date and time string"),
      )
      expect(() => setORMQueryFilterValue("2023-01-01T01:00:00.000Z")).toThrow(
        new HatchifyCoerceError("before or on 2023-01-01T00:00:00.000Z"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'datetime({"min":null,"max":"2023-01-01T00:00:00.000Z"})',
        orm: {
          sequelize: {
            type: "DATE",
            typeArgs: [],
            allowNull: true,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "Datetime",
          displayName: null,
          hidden: false,
          allowNull: true,
          min: -Infinity,
          max: new Date("2023-01-01T00:00:00.000Z"),
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
