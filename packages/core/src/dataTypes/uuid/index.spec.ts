import { UUID_REGEX } from "./constants.js"
import { HatchifyCoerceError } from "../../types/index.js"

import { uuid } from "./index.js"

describe("uuid", () => {
  describe("uuid()", () => {
    const type = uuid()

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: "uuid()",
        orm: {
          sequelize: {
            type: "UUID",
            allowNull: undefined,
            primaryKey: undefined,
          },
        },
        control: {
          type: "String",
          allowNull: undefined,
          min: 36,
          max: 36,
          primary: undefined,
          regex: UUID_REGEX,
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
      expect(
        setClientPropertyValue?.("6ca2929f-c66d-4542-96a9-f1a6aa3d2678"),
      ).toBe("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")
      expect(setClientPropertyValue?.(null)).toBeNull()
      expect(() => setClientPropertyValue?.(7)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // serializeClientPropertyValue
      expect(
        serializeClientPropertyValue?.("6ca2929f-c66d-4542-96a9-f1a6aa3d2678"),
      ).toBe("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")
      expect(serializeClientPropertyValue?.(null)).toBeNull()

      // setClientQueryFilterValue
      expect(
        setClientQueryFilterValue?.("6ca2929f-c66d-4542-96a9-f1a6aa3d2678"),
      ).toBe("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")
      expect(setClientQueryFilterValue?.(null)).toBeNull()
      expect(() => setClientQueryFilterValue?.(7)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // serializeClientQueryFilterValue
      expect(
        serializeClientQueryFilterValue?.(
          "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
        ),
      ).toBe("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")
      expect(serializeClientQueryFilterValue?.(null)).toBe("null")

      // setClientPropertyValueFromResponse
      expect(
        setClientPropertyValueFromResponse?.(
          "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
        ),
      ).toBe("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")
      expect(setClientPropertyValueFromResponse?.(null)).toBeNull()

      // serializeORMPropertyValue
      expect(
        serializeORMPropertyValue("6ca2929f-c66d-4542-96a9-f1a6aa3d2678"),
      ).toBe("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")
      expect(serializeORMPropertyValue(null)).toBeNull()
      expect(() => serializeORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("with length greater than or equal to 36"),
      )
      expect(() =>
        serializeORMPropertyValue("institut-ions-0999-ABCD-TestBranch00"),
      ).toThrow(new HatchifyCoerceError(`with format of ${UUID_REGEX}`))
      expect(() => serializeORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")).toBe(
        "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
      )
      expect(setORMPropertyValue(null)).toBeNull()
      expect(setORMPropertyValue(undefined)).toBeNull()
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("with length greater than or equal to 36"),
      )
      expect(() =>
        setORMPropertyValue("institut-ions-0999-ABCD-TestBranch00"),
      ).toThrow(new HatchifyCoerceError(`with format of ${UUID_REGEX}`))
      expect(() => setORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // setORMQueryFilterValue
      expect(
        setORMQueryFilterValue("6ca2929f-c66d-4542-96a9-f1a6aa3d2678"),
      ).toBe("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")
      expect(setORMQueryFilterValue("null")).toBeNull()
      expect(setORMQueryFilterValue("undefined")).toBeNull()
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: "uuid()",
        orm: {
          sequelize: {
            type: "UUID",
            allowNull: true,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "String",
          allowNull: true,
          min: 36,
          max: 36,
          primary: false,
          default: null,
          regex: UUID_REGEX,
          ui: {
            enableCaseSensitiveContains: false,
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

  describe("uuid({required: true})", () => {
    const type = uuid({ required: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'uuid({"required":true})',
        orm: {
          sequelize: {
            type: "UUID",
            allowNull: false,
            primaryKey: undefined,
          },
        },
        control: {
          type: "String",
          allowNull: false,
          allowNullInfer: false,
          min: 36,
          max: 36,
          primary: undefined,
          regex: UUID_REGEX,
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
      expect(
        setClientPropertyValue?.("6ca2929f-c66d-4542-96a9-f1a6aa3d2678"),
      ).toBe("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")
      expect(() => setClientPropertyValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientPropertyValue?.(7)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // serializeClientPropertyValue
      expect(
        serializeClientPropertyValue?.("6ca2929f-c66d-4542-96a9-f1a6aa3d2678"),
      ).toBe("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")
      // does not throw because it expects a coerced value
      expect(serializeClientPropertyValue?.(null)).toBeNull()

      // setClientQueryFilterValue
      expect(
        setClientQueryFilterValue?.("6ca2929f-c66d-4542-96a9-f1a6aa3d2678"),
      ).toBe("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")
      expect(() => setClientQueryFilterValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientQueryFilterValue?.(7)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // serializeClientQueryFilterValue
      expect(
        serializeClientQueryFilterValue?.(
          "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
        ),
      ).toBe("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")
      // does not throw because it expects a coerced value
      expect(serializeClientQueryFilterValue?.(null)).toBe("null")

      // setClientPropertyValueFromResponse
      expect(
        setClientPropertyValueFromResponse?.(
          "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
        ),
      ).toBe("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")
      expect(() => setClientPropertyValueFromResponse?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )

      // serializeORMPropertyValue
      expect(
        serializeORMPropertyValue("6ca2929f-c66d-4542-96a9-f1a6aa3d2678"),
      ).toBe("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => serializeORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("with length greater than or equal to 36"),
      )
      expect(() =>
        serializeORMPropertyValue("institut-ions-0999-ABCD-TestBranch00"),
      ).toThrow(new HatchifyCoerceError(`with format of ${UUID_REGEX}`))
      expect(() => serializeORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")).toBe(
        "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
      )
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMPropertyValue(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("with length greater than or equal to 36"),
      )
      expect(() =>
        setORMPropertyValue("institut-ions-0999-ABCD-TestBranch00"),
      ).toThrow(new HatchifyCoerceError(`with format of ${UUID_REGEX}`))
      expect(() => setORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // setORMQueryFilterValue
      expect(
        setORMQueryFilterValue("6ca2929f-c66d-4542-96a9-f1a6aa3d2678"),
      ).toBe("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")
      expect(() => setORMQueryFilterValue("null")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("undefined")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'uuid({"required":true})',
        orm: {
          sequelize: {
            type: "UUID",
            allowNull: false,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        control: {
          type: "String",
          allowNull: false,
          min: 36,
          max: 36,
          primary: false,
          default: null,
          regex: UUID_REGEX,
          ui: {
            enableCaseSensitiveContains: false,
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

  describe("uuid({primary: true})", () => {
    const type = uuid({ primary: true })

    it("prepares correctly", () => {
      expect(type).toEqual({
        name: 'uuid({"primary":true})',
        orm: {
          sequelize: {
            type: "UUID",
            allowNull: undefined,
            primaryKey: true,
          },
        },
        control: {
          type: "String",
          allowNull: undefined,
          min: 36,
          max: 36,
          primary: true,
          regex: UUID_REGEX,
          ui: {
            displayName: undefined,
            hidden: false,
          },
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
      expect(
        setClientPropertyValue?.("6ca2929f-c66d-4542-96a9-f1a6aa3d2678"),
      ).toBe("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")
      expect(() => setClientPropertyValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientPropertyValue?.(7)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // serializeClientPropertyValue
      expect(
        serializeClientPropertyValue?.("6ca2929f-c66d-4542-96a9-f1a6aa3d2678"),
      ).toBe("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")
      // does not throw because it expects a coerced value
      expect(serializeClientPropertyValue?.(null)).toBeNull()

      // setClientQueryFilterValue
      expect(
        setClientQueryFilterValue?.("6ca2929f-c66d-4542-96a9-f1a6aa3d2678"),
      ).toBe("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")
      expect(() => setClientQueryFilterValue?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setClientQueryFilterValue?.(7)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // serializeClientQueryFilterValue
      expect(
        serializeClientQueryFilterValue?.(
          "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
        ),
      ).toBe("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")
      // does not throw because it expects a coerced value
      expect(serializeClientQueryFilterValue?.(null)).toBe("null")

      // setClientPropertyValueFromResponse
      expect(
        setClientPropertyValueFromResponse?.(
          "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
        ),
      ).toBe("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")
      expect(() => setClientPropertyValueFromResponse?.(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )

      // serializeORMPropertyValue
      expect(
        serializeORMPropertyValue("6ca2929f-c66d-4542-96a9-f1a6aa3d2678"),
      ).toBe("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")
      expect(() => serializeORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => serializeORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("with length greater than or equal to 36"),
      )
      expect(() =>
        serializeORMPropertyValue("institut-ions-0999-ABCD-TestBranch00"),
      ).toThrow(new HatchifyCoerceError(`with format of ${UUID_REGEX}`))
      expect(() => serializeORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // setORMPropertyValue
      expect(setORMPropertyValue("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")).toBe(
        "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
      )
      expect(() => setORMPropertyValue(null)).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMPropertyValue(undefined)).toThrow(
        new HatchifyCoerceError("as a non-undefined value"),
      )
      expect(() => setORMPropertyValue("invalid")).toThrow(
        new HatchifyCoerceError("with length greater than or equal to 36"),
      )
      expect(() =>
        setORMPropertyValue("institut-ions-0999-ABCD-TestBranch00"),
      ).toThrow(new HatchifyCoerceError(`with format of ${UUID_REGEX}`))
      expect(() => setORMPropertyValue(1 as unknown as string)).toThrow(
        new HatchifyCoerceError("as a string"),
      )

      // setORMQueryFilterValue
      expect(
        setORMQueryFilterValue("6ca2929f-c66d-4542-96a9-f1a6aa3d2678"),
      ).toBe("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")
      expect(() => setORMQueryFilterValue("null")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
      expect(() => setORMQueryFilterValue("undefined")).toThrow(
        new HatchifyCoerceError("as a non-null value"),
      )
    })

    it("finalizes correctly", () => {
      expect(type.finalize()).toEqual({
        name: 'uuid({"primary":true})',
        orm: {
          sequelize: {
            type: "UUID",
            allowNull: false,
            primaryKey: true,
            unique: true,
            defaultValue: null,
          },
        },
        control: {
          type: "String",
          allowNull: false,
          min: 36,
          max: 36,
          primary: true,
          default: null,
          regex: UUID_REGEX,
          ui: {
            enableCaseSensitiveContains: false,
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
