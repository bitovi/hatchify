import { finalizeControl } from "./finalizeControl.js"

describe("finalizeControl", () => {
  const values = ["foo", "bar"]

  it("handles allowNull", () => {
    expect(
      finalizeControl({ values, type: "enum", allowNull: undefined }).allowNull,
    ).toBe(true)
    expect(
      finalizeControl({
        values,
        type: "enum",
        allowNull: null as unknown as boolean,
      }).allowNull,
    ).toBe(true)
    expect(
      finalizeControl({ values, type: "enum", allowNull: true }).allowNull,
    ).toBe(true)
    expect(
      finalizeControl({ values, type: "enum", allowNull: false }).allowNull,
    ).toBe(false)
  })

  it("handles primary", () => {
    expect(
      finalizeControl({ values, type: "enum", primary: undefined }).primary,
    ).toBe(false)
    expect(
      finalizeControl({
        values,
        type: "enum",
        primary: null as unknown as boolean,
      }).primary,
    ).toBe(false)
    expect(
      finalizeControl({ values, type: "enum", primary: true }).primary,
    ).toBe(true)
    expect(
      finalizeControl({ values, type: "enum", primary: false }).primary,
    ).toBe(false)
  })

  it("handles default", () => {
    expect(
      finalizeControl({ values, type: "enum", default: undefined }).default,
    ).toBeNull()
    expect(
      finalizeControl({ values, type: "enum", default: null }).default,
    ).toBeNull()
    expect(
      finalizeControl({ values, type: "enum", default: "foo" }).default,
    ).toBe("foo")

    const func = () => "bar"

    expect(
      finalizeControl({ values, type: "enum", default: func }).default,
    ).toEqual(func)
  })
})
