import { finalizeControl } from "./finalizeControl"

describe("finalizeControl", () => {
  it("handles allowNull", () => {
    expect(
      finalizeControl({
        type: "String",
        allowNull: undefined,
        hidden: null,
      }).allowNull,
    ).toBe(true)
    expect(
      finalizeControl({
        type: "String",
        allowNull: null as unknown as boolean,
        hidden: null,
      }).allowNull,
    ).toBe(true)
    expect(
      finalizeControl({ type: "String", allowNull: true, hidden: null })
        .allowNull,
    ).toBe(true)
    expect(
      finalizeControl({ type: "String", allowNull: false, hidden: null })
        .allowNull,
    ).toBe(false)
  })

  it("handles primary", () => {
    expect(
      finalizeControl({ type: "String", primary: undefined, hidden: null })
        .primary,
    ).toBe(false)
    expect(
      finalizeControl({
        type: "String",
        primary: null as unknown as boolean,
        hidden: null,
      }).primary,
    ).toBe(false)
    expect(
      finalizeControl({ type: "String", primary: true, hidden: null }).primary,
    ).toBe(true)
    expect(
      finalizeControl({ type: "String", primary: false, hidden: null }).primary,
    ).toBe(false)
  })

  it("handles default", () => {
    expect(
      finalizeControl({ type: "String", default: undefined, hidden: null })
        .default,
    ).toBeNull()
    expect(
      finalizeControl({ type: "String", default: null, hidden: null }).default,
    ).toBeNull()
    expect(
      finalizeControl({ type: "String", default: "test", hidden: null })
        .default,
    ).toBe("test")

    const func = () => "test"

    expect(
      finalizeControl({ type: "String", default: func, hidden: null }).default,
    ).toEqual(func)
  })
})
