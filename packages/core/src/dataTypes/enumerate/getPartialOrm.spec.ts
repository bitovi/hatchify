import { getPartialOrm } from "./getPartialOrm.js"
import type { PartialEnumProps } from "./types.js"
import { HatchifyInvalidSchemaError } from "../../types/index.js"

describe("getPartialOrm", () => {
  const values = ["foo", "bar"]

  it("handles required", () => {
    expect(
      getPartialOrm({ values, required: undefined }).sequelize.allowNull,
    ).toBeUndefined()
    expect(
      getPartialOrm({ values, required: null as unknown as boolean }).sequelize
        .allowNull,
    ).toBeNull()
    expect(getPartialOrm({ values, required: true }).sequelize.allowNull).toBe(
      false,
    )
    expect(getPartialOrm({ values, required: false }).sequelize.allowNull).toBe(
      true,
    )
  })

  it("handles primaryKey", () => {
    expect(
      getPartialOrm({ values, primary: undefined }).sequelize.primaryKey,
    ).toBeUndefined()
    expect(
      getPartialOrm({ values, primary: null as unknown as boolean }).sequelize
        .primaryKey,
    ).toBeNull()
    expect(getPartialOrm({ values, primary: true }).sequelize.primaryKey).toBe(
      true,
    )
    expect(getPartialOrm({ values, primary: false }).sequelize.primaryKey).toBe(
      false,
    )
  })

  it("handles default", () => {
    expect(
      getPartialOrm({ values, default: undefined }).sequelize.defaultValue,
    ).toBeUndefined()
    expect(
      getPartialOrm({ values, default: null }).sequelize.defaultValue,
    ).toBeNull()
    expect(
      getPartialOrm({ values, default: "foo" }).sequelize.defaultValue,
    ).toBe("foo")

    const func = () => "bar"

    expect(
      getPartialOrm({ values, default: func }).sequelize.defaultValue,
    ).toEqual(func)
  })

  it("handles unique", () => {
    expect(
      getPartialOrm({ values, unique: undefined }).sequelize.unique,
    ).toBeUndefined()
    expect(
      getPartialOrm({ values, unique: null as unknown as boolean }).sequelize
        .unique,
    ).toBeNull()
    expect(getPartialOrm({ values, unique: true }).sequelize.unique).toBe(true)
    expect(getPartialOrm({ values, unique: false }).sequelize.unique).toBe(
      false,
    )
  })

  it("handles invalid values", () => {
    expect(() =>
      getPartialOrm({} as unknown as PartialEnumProps<boolean, string[]>),
    ).toThrow(
      new HatchifyInvalidSchemaError(
        "enum must be called with values as a non-empty string array",
      ),
    )
    expect(() =>
      getPartialOrm({ values: null } as unknown as PartialEnumProps<
        boolean,
        string[]
      >),
    ).toThrow(
      new HatchifyInvalidSchemaError(
        "enum must be called with values as a non-empty string array",
      ),
    )
    expect(() =>
      getPartialOrm({ values: 1 } as unknown as PartialEnumProps<
        boolean,
        string[]
      >),
    ).toThrow(
      new HatchifyInvalidSchemaError(
        "enum must be called with values as a non-empty string array",
      ),
    )
    expect(() =>
      getPartialOrm({ values: "foo" } as unknown as PartialEnumProps<
        boolean,
        string[]
      >),
    ).toThrow(
      new HatchifyInvalidSchemaError(
        "enum must be called with values as a non-empty string array",
      ),
    )
    expect(() =>
      getPartialOrm({ values: [] } as unknown as PartialEnumProps<
        boolean,
        string[]
      >),
    ).toThrow(
      new HatchifyInvalidSchemaError(
        "enum must be called with values as a non-empty string array",
      ),
    )
  })
})
