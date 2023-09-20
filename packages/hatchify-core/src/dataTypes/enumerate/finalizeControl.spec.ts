import { finalizeControl } from "./finalizeControl"

describe("finalizeControl", () => {
  const values = ["foo", "bar"]

  it("handles allowNull", () => {
    expect(
      finalizeControl({ values, type: "String", allowNull: undefined })
        .allowNull,
    ).toBe(true)
    expect(
      finalizeControl({
        values,
        type: "String",
        allowNull: null as unknown as boolean,
      }).allowNull,
    ).toBe(true)
    expect(
      finalizeControl({ values, type: "String", allowNull: true }).allowNull,
    ).toBe(true)
    expect(
      finalizeControl({ values, type: "String", allowNull: false }).allowNull,
    ).toBe(false)
  })

  it("handles primary", () => {
    expect(
      finalizeControl({ values, type: "String", primary: undefined }).primary,
    ).toBe(false)
    expect(
      finalizeControl({
        values,
        type: "String",
        primary: null as unknown as boolean,
      }).primary,
    ).toBe(false)
    expect(
      finalizeControl({ values, type: "String", primary: true }).primary,
    ).toBe(true)
    expect(
      finalizeControl({ values, type: "String", primary: false }).primary,
    ).toBe(false)
  })

  it("handles default", () => {
    expect(
      finalizeControl({ values, type: "String", default: undefined }).default,
    ).toBeNull()
    expect(
      finalizeControl({ values, type: "String", default: null }).default,
    ).toBeNull()
    expect(
      finalizeControl({ values, type: "String", default: "foo" }).default,
    ).toBe("foo")

    const func = () => "bar"

    expect(
      finalizeControl({ values, type: "String", default: func }).default,
    ).toEqual(func)
  })
})
