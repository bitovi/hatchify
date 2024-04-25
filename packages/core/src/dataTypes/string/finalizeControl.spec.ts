import { finalizeControl } from "./finalizeControl.js"

describe("finalizeControl", () => {
  it("handles allowNull", () => {
    expect(
      finalizeControl({ type: "String", allowNull: undefined }).allowNull,
    ).toBe(true)
    expect(
      finalizeControl({ type: "String", allowNull: null as unknown as boolean })
        .allowNull,
    ).toBe(true)
    expect(finalizeControl({ type: "String", allowNull: true }).allowNull).toBe(
      true,
    )
    expect(
      finalizeControl({ type: "String", allowNull: false }).allowNull,
    ).toBe(false)
  })

  it("handles primary", () => {
    expect(
      finalizeControl({ type: "String", primary: undefined }).primary,
    ).toBe(false)
    expect(
      finalizeControl({ type: "String", primary: null as unknown as boolean })
        .primary,
    ).toBe(false)
    expect(finalizeControl({ type: "String", primary: true }).primary).toBe(
      true,
    )
    expect(finalizeControl({ type: "String", primary: false }).primary).toBe(
      false,
    )
  })

  it("handles default", () => {
    expect(
      finalizeControl({ type: "String", default: undefined }).default,
    ).toBeNull()
    expect(
      finalizeControl({ type: "String", default: null }).default,
    ).toBeNull()
    expect(finalizeControl({ type: "String", default: "test" }).default).toBe(
      "test",
    )

    const func = () => "test"

    expect(finalizeControl({ type: "String", default: func }).default).toEqual(
      func,
    )
  })

  it("handles ui", () => {
    expect(finalizeControl({ type: "String", ui: undefined }).ui).toEqual({
      enableCaseSensitiveContains: false,
      hidden: false,
      displayName: null,
      maxDisplayLength: null,
    })
    expect(finalizeControl({ type: "String", ui: {} }).ui).toEqual({
      enableCaseSensitiveContains: false,
      hidden: false,
      displayName: null,
      maxDisplayLength: null,
    })
    expect(
      finalizeControl({
        type: "String",
        ui: {
          enableCaseSensitiveContains: false,
          displayName: "Test",
          maxDisplayLength: 50,
        },
      }).ui,
    ).toEqual({
      enableCaseSensitiveContains: false,
      hidden: false,
      displayName: "Test",
      maxDisplayLength: 50,
    })
    expect(
      finalizeControl({
        type: "String",
        ui: { enableCaseSensitiveContains: true, hidden: true },
      }).ui,
    ).toEqual({
      enableCaseSensitiveContains: true,
      hidden: true,
      displayName: null,
      maxDisplayLength: null,
    })
  })
})
