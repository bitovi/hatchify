import { HatchifyCoerceError } from "../../types"

import { dateonly } from "."

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
        new HatchifyCoerceError("as an ISO 8601 date string"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as string),
      ).toThrow(new HatchifyCoerceError("as an ISO 8601 date string"))

      // setORMPropertyValue
      expect(setORMPropertyValue("2023-01-01")).toEqual("2023-01-01")
      expect(setORMPropertyValue(null)).toBeNull()
      expect(setORMPropertyValue(undefined)).toBeNull()
      expect(() => setORMPropertyValue(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("2023-01-01")).toEqual("2023-01-01")
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
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
            defaultValue: null,
          },
        },
        control: {
          type: "Dateonly",
          allowNull: true,
          min: -Infinity,
          max: Infinity,
          primary: false,
          default: null,
        },
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
        new HatchifyCoerceError("as an ISO 8601 date string"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as string),
      ).toThrow(new HatchifyCoerceError("as an ISO 8601 date string"))

      // setORMPropertyValue
      expect(setORMPropertyValue("2023-01-01")).toEqual("2023-01-01")
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMPropertyValue(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
      )
      expect(() => setORMPropertyValue(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
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
        new HatchifyCoerceError("as an ISO 8601 date string"),
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
            defaultValue: null,
          },
        },
        control: {
          type: "Dateonly",
          allowNull: false,
          min: -Infinity,
          max: Infinity,
          primary: false,
          default: null,
        },
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
        new HatchifyCoerceError("as an ISO 8601 date string"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as string),
      ).toThrow(new HatchifyCoerceError("as an ISO 8601 date string"))

      // setORMPropertyValue
      expect(setORMPropertyValue("2023-01-01")).toEqual("2023-01-01")
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMPropertyValue(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
      )
      expect(() => setORMPropertyValue(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
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
        new HatchifyCoerceError("as an ISO 8601 date string"),
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
            defaultValue: null,
          },
        },
        control: {
          type: "Dateonly",
          allowNull: false,
          min: -Infinity,
          max: Infinity,
          primary: true,
          default: null,
        },
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
        new HatchifyCoerceError("as an ISO 8601 date string"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as string),
      ).toThrow(new HatchifyCoerceError("as an ISO 8601 date string"))
      expect(() => serializeORMPropertyValue("2023-01-02")).toThrow(
        new HatchifyCoerceError("before or on 2023-01-01"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue("2023-01-01")).toEqual("2023-01-01")
      expect(setORMPropertyValue(null)).toBeNull()
      expect(setORMPropertyValue(undefined)).toBeNull()
      expect(() => setORMPropertyValue(1)).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
      )
      expect(() => setORMPropertyValue("2023-01-02")).toThrow(
        new HatchifyCoerceError("before or on 2023-01-01"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("2023-01-01")).toEqual("2023-01-01")
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as an ISO 8601 date string"),
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
            defaultValue: null,
          },
        },
        control: {
          type: "Dateonly",
          allowNull: true,
          min: -Infinity,
          max: "2023-01-01",
          primary: false,
          default: null,
        },
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      })
    })
  })
})
