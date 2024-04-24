import { HatchifyCoerceError } from "../../types/index.js"

import { boolean } from "./index.js"

describe("boolean", () => {
  describe("boolean()", () => {
    const type = boolean()

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: "boolean()",
        orm: {
          sequelize: {
            type: "BOOLEAN",
            allowNull: undefined,
          },
        },
        control: {
          type: "Boolean",
          allowNull: undefined,
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
      expect(serializeORMPropertyValue(true)).toBe(true)
      expect(serializeORMPropertyValue(false)).toBe(false)
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as boolean),
      ).toThrow(new HatchifyCoerceError("as a boolean"))

      // setORMPropertyValue
      expect(setORMPropertyValue(true)).toBe(true)
      expect(setORMPropertyValue(false)).toBe(false)
      expect(setORMPropertyValue(null)).toBeNull()
      expect(setORMPropertyValue(undefined)).toBeNull()
      expect(() =>
        setORMPropertyValue("invalid" as unknown as boolean),
      ).toThrow(new HatchifyCoerceError("as a boolean"))

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("true")).toBe(true)
      expect(setORMQueryFilterValue("false")).toBe(false)
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as a boolean"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: "boolean()",
        orm: {
          sequelize: {
            type: "BOOLEAN",
            allowNull: true,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "Boolean",
          displayName: null,
          hidden: false,
          readOnly: false,
          allowNull: true,
          primary: false,
          default: null,
        },
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      })
    })
  })

  describe("boolean({required: true})", () => {
    const type = boolean({ required: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'boolean({"required":true})',
        orm: {
          sequelize: {
            type: "BOOLEAN",
            allowNull: false,
          },
        },
        control: {
          type: "Boolean",
          allowNull: false,
          allowNullInfer: false,
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
      expect(serializeORMPropertyValue(true)).toBe(true)
      expect(serializeORMPropertyValue(false)).toBe(false)
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as boolean),
      ).toThrow(new HatchifyCoerceError("as a boolean"))

      // setORMPropertyValue
      expect(setORMPropertyValue(true)).toBe(true)
      expect(setORMPropertyValue(false)).toBe(false)
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMPropertyValue(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
      )
      expect(() =>
        setORMPropertyValue("invalid" as unknown as boolean),
      ).toThrow(new HatchifyCoerceError("as a boolean"))

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("true")).toBe(true)
      expect(setORMQueryFilterValue("false")).toBe(false)
      expect(() => setORMQueryFilterValue("null")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("undefined")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as a boolean"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'boolean({"required":true})',
        orm: {
          sequelize: {
            type: "BOOLEAN",
            allowNull: false,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "Boolean",
          displayName: null,
          hidden: false,
          readOnly: false,
          allowNull: false,
          primary: false,
          default: null,
        },
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      })
    })
  })

  describe("boolean({primary: true})", () => {
    const type = boolean({ primary: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'boolean({"primary":true})',
        orm: {
          sequelize: {
            type: "BOOLEAN",
            primaryKey: true,
          },
        },
        control: {
          type: "Boolean",
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
      expect(serializeORMPropertyValue(true)).toBe(true)
      expect(serializeORMPropertyValue(false)).toBe(false)
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as boolean),
      ).toThrow(new HatchifyCoerceError("as a boolean"))

      // setORMPropertyValue
      expect(setORMPropertyValue(true)).toBe(true)
      expect(setORMPropertyValue(false)).toBe(false)
      expect(setORMPropertyValue(null)).toBeNull()
      expect(setORMPropertyValue(undefined)).toBeNull()
      expect(() =>
        setORMPropertyValue("invalid" as unknown as boolean),
      ).toThrow(new HatchifyCoerceError("as a boolean"))

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("true")).toBe(true)
      expect(setORMQueryFilterValue("false")).toBe(false)
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as a boolean"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'boolean({"primary":true})',
        orm: {
          sequelize: {
            type: "BOOLEAN",
            allowNull: true,
            primaryKey: true,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "Boolean",
          displayName: null,
          hidden: false,
          readOnly: false,
          allowNull: true,
          primary: true,
          default: null,
        },
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      })
    })
  })

  describe("boolean({readOnly: true})", () => {
    const type = boolean({ readOnly: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'boolean({"readOnly":true})',
        orm: {
          sequelize: {
            type: "BOOLEAN",
            allowNull: undefined,
          },
        },
        control: {
          type: "Boolean",
          allowNull: undefined,
          readOnly: true,
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
      expect(serializeORMPropertyValue(true)).toBe(true)
      expect(serializeORMPropertyValue(false)).toBe(false)
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() =>
        serializeORMPropertyValue("invalid" as unknown as boolean),
      ).toThrow(new HatchifyCoerceError("as a boolean"))

      // setORMPropertyValue
      expect(() => setORMPropertyValue(true)).toThrow(
        new HatchifyCoerceError("as a read-only value"),
      )
      expect(() => setORMPropertyValue(false)).toThrow(
        new HatchifyCoerceError("as a read-only value"),
      )
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a read-only value"),
      )
      expect(() => setORMPropertyValue(undefined)).toThrow(
        new HatchifyCoerceError("as a read-only value"),
      )
      expect(() =>
        setORMPropertyValue("invalid" as unknown as boolean),
      ).toThrow(new HatchifyCoerceError("as a read-only value"))

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("true")).toBe(true)
      expect(setORMQueryFilterValue("false")).toBe(false)
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as a boolean"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'boolean({"readOnly":true})',
        orm: {
          sequelize: {
            type: "BOOLEAN",
            allowNull: true,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "Boolean",
          displayName: null,
          hidden: false,
          readOnly: true,
          allowNull: true,
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
