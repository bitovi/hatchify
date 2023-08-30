import { HatchifyCoerceError } from "../../types"

import { enumerate } from "."

describe("enumerate", () => {
  const values = ["valid", "valid2"]

  describe("enumerate({ values: ['valid', 'valid2']})", () => {
    const type = enumerate({ values })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'enumerate({"values":["valid","valid2"]})',
        orm: {
          sequelize: {
            type: "ENUM",
            typeArgs: values,
            allowNull: undefined,
            primaryKey: undefined,
          },
        },
        control: {
          type: "String",
          allowNull: undefined,
          primary: undefined,
          values,
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
      expect(serializeORMPropertyValue("valid")).toBe("valid")
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() => serializeORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )
      expect(() => serializeORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue("valid")).toBe("valid")
      expect(setORMPropertyValue(null)).toBeNull()
      expect(() => setORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("valid")).toBe("valid")
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'enumerate({"values":["valid","valid2"]})',
        orm: {
          sequelize: {
            type: "ENUM",
            typeArgs: values,
            allowNull: true,
            primaryKey: false,
          },
        },
        control: {
          type: "String",
          allowNull: true,
          primary: false,
          values,
        },
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      })
    })
  })

  describe("enumerate({ values: ['valid', 'valid2'], required: true})", () => {
    const type = enumerate({ values, required: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'enumerate({"values":["valid","valid2"],"required":true})',
        orm: {
          sequelize: {
            type: "ENUM",
            typeArgs: values,
            allowNull: false,
            primaryKey: undefined,
          },
        },
        control: {
          type: "String",
          allowNull: false,
          primary: undefined,
          values,
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
      expect(serializeORMPropertyValue("valid")).toBe("valid")
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => serializeORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )
      expect(() => serializeORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue("valid")).toBe("valid")
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("valid")).toBe("valid")
      expect(() => setORMQueryFilterValue("null")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("undefined")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'enumerate({"values":["valid","valid2"],"required":true})',
        orm: {
          sequelize: {
            type: "ENUM",
            typeArgs: values,
            allowNull: false,
            primaryKey: false,
          },
        },
        control: {
          type: "String",
          allowNull: false,
          primary: false,
          values,
        },
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      })
    })
  })

  describe("enumerate({ values: ['valid', 'valid2'], primary: true})", () => {
    const type = enumerate({ values, primary: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'enumerate({"values":["valid","valid2"],"primary":true})',
        orm: {
          sequelize: {
            type: "ENUM",
            typeArgs: values,
            allowNull: undefined,
            primaryKey: true,
          },
        },
        control: {
          type: "String",
          allowNull: undefined,
          primary: true,
          values,
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
      expect(serializeORMPropertyValue("valid")).toBe("valid")
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => serializeORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )
      expect(() => serializeORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue("valid")).toBe("valid")
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )

      // setORMQueryFilterValue
      expect(setORMQueryFilterValue("valid")).toBe("valid")
      expect(() => setORMQueryFilterValue("null")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("undefined")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("invalid")).toThrow(
        new HatchifyCoerceError("as one of 'valid', 'valid2'"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'enumerate({"values":["valid","valid2"],"primary":true})',
        orm: {
          sequelize: {
            type: "ENUM",
            typeArgs: values,
            allowNull: false,
            primaryKey: true,
          },
        },
        control: {
          type: "String",
          allowNull: false,
          primary: true,
          values,
        },
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      })
    })
  })
})
