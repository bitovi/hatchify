import { finalizeControl } from "./finalizeControl"

describe("finalizeControl", () => {
  it("handles allowNull", () => {
    expect(
      finalizeControl({
        type: "String",
        allowNull: undefined,
        references: null,
      }).allowNull,
    ).toBe(true)
    expect(
      finalizeControl({
        type: "String",
        allowNull: null as unknown as boolean,
        references: null,
      }).allowNull,
    ).toBe(true)
    expect(
      finalizeControl({ type: "String", allowNull: true, references: null })
        .allowNull,
    ).toBe(true)
    expect(
      finalizeControl({ type: "String", allowNull: false, references: null })
        .allowNull,
    ).toBe(false)
  })

  it("handles primary", () => {
    expect(
      finalizeControl({ type: "String", primary: undefined, references: null })
        .primary,
    ).toBe(false)
    expect(
      finalizeControl({
        type: "String",
        primary: null as unknown as boolean,
        references: null,
      }).primary,
    ).toBe(false)
    expect(
      finalizeControl({ type: "String", primary: true, references: null })
        .primary,
    ).toBe(true)
    expect(
      finalizeControl({ type: "String", primary: false, references: null })
        .primary,
    ).toBe(false)
  })

  it("handles default", () => {
    expect(
      finalizeControl({ type: "String", default: undefined, references: null })
        .default,
    ).toBeNull()
    expect(
      finalizeControl({ type: "String", default: null, references: null })
        .default,
    ).toBeNull()
    expect(
      finalizeControl({ type: "String", default: "test", references: null })
        .default,
    ).toBe("test")

    const func = () => "test"

    expect(
      finalizeControl({ type: "String", default: func, references: null })
        .default,
    ).toEqual(func)
  })
})
