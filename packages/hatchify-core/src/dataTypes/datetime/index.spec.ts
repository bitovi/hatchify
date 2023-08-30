import { HatchifyCoerceError } from "../../types"

import { datetime } from "."

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
      } = type.finalize()

      // serializeORMPropertyValue
      expect(
        serializeORMPropertyValue(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() => serializeORMPropertyValue(1 as unknown as Date)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as Date),
      ).toThrow(new HatchifyCoerceError("as an ISO 8601 date string"))

      // setORMPropertyValue
      expect(setORMPropertyValue(new Date("2023-01-01T00:00:00.000Z"))).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(setORMPropertyValue(null)).toBeNull()
      expect(() => setORMPropertyValue(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("2023-01-01T00:00:00.000Z")).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
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
          },
        },
        control: {
          type: "Datetime",
          allowNull: true,
          min: -Infinity,
          max: Infinity,
          primary: false,
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
      } = type.finalize()

      // serializeORMPropertyValue
      expect(
        serializeORMPropertyValue(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => serializeORMPropertyValue(1 as unknown as Date)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as Date),
      ).toThrow(new HatchifyCoerceError("as an ISO 8601 date string"))

      // setORMPropertyValue
      expect(setORMPropertyValue(new Date("2023-01-01T00:00:00.000Z"))).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMPropertyValue(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
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
        new HatchifyCoerceError("as an ISO 8601 date string"),
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
          },
        },
        control: {
          type: "Datetime",
          allowNull: false,
          min: -Infinity,
          max: Infinity,
          primary: false,
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
      } = type.finalize()

      // serializeORMPropertyValue
      expect(
        serializeORMPropertyValue(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => serializeORMPropertyValue(1 as unknown as Date)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as Date),
      ).toThrow(new HatchifyCoerceError("as an ISO 8601 date string"))

      // setORMPropertyValue
      expect(setORMPropertyValue(new Date("2023-01-01T00:00:00.000Z"))).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMPropertyValue(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
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
        new HatchifyCoerceError("as an ISO 8601 date string"),
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
          },
        },
        control: {
          type: "Datetime",
          allowNull: false,
          min: -Infinity,
          max: Infinity,
          primary: true,
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
      } = type.finalize()

      // serializeORMPropertyValue
      expect(
        serializeORMPropertyValue(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() => serializeORMPropertyValue(1 as unknown as Date)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as Date),
      ).toThrow(new HatchifyCoerceError("as an ISO 8601 date string"))
      expect(() =>
        serializeORMPropertyValue(new Date("2023-01-01T01:00:00.000Z")),
      ).toThrow(new HatchifyCoerceError("as multiples of day"))

      // setORMPropertyValue
      expect(setORMPropertyValue(new Date("2023-01-01T00:00:00.000Z"))).toEqual(
        new Date("2023-01-01T00:00:00.000Z"),
      )
      expect(setORMPropertyValue(null)).toBeNull()
      expect(() => setORMPropertyValue(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
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
        new HatchifyCoerceError("as an ISO 8601 date string"),
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
          },
        },
        control: {
          type: "Datetime",
          allowNull: true,
          min: -Infinity,
          max: Infinity,
          primary: false,
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

      // todo: HATCH-348
      expect(setClientPropertyValue(null)).toEqual(null)
      expect(serializeClientPropertyValue(null)).toEqual(null)
      expect(setClientQueryFilterValue(null)).toEqual(null)
      expect(serializeClientQueryFilterValue(null)).toEqual("")
      expect(setClientPropertyValueFromResponse(null)).toEqual(null)

      // serializeORMPropertyValue
      expect(
        serializeORMPropertyValue(new Date("2023-01-01T00:00:00.000Z")),
      ).toEqual(new Date("2023-01-01T00:00:00.000Z"))
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() => serializeORMPropertyValue(1 as unknown as Date)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as Date),
      ).toThrow(new HatchifyCoerceError("as an ISO 8601 date string"))
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
      expect(() => setORMPropertyValue(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
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
        new HatchifyCoerceError("as an ISO 8601 date string"),
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
          },
        },
        control: {
          type: "Datetime",
          allowNull: true,
          min: -Infinity,
          max: new Date("2023-01-01T00:00:00.000Z"),
          primary: false,
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
