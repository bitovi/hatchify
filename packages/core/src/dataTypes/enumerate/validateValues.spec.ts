import { validateValues } from "./validateValues"

describe("validateValues", () => {
  it("validates an array of strings", () => {
    expect(validateValues(["foo"])).toBe(true)
    expect(validateValues(["foo", "bar"])).toBe(true)
    expect(validateValues(null as unknown as string[])).toBe(false)
    expect(validateValues(undefined as unknown as string[])).toBe(false)
    expect(validateValues(1 as unknown as string[])).toBe(false)
    expect(validateValues("string" as unknown as string[])).toBe(false)
    expect(validateValues({} as unknown as string[])).toBe(false)
    expect(validateValues({ foo: "bar" } as unknown as string[])).toBe(false)
    expect(
      validateValues((() => {
        /* noop */
      }) as unknown as string[]),
    ).toBe(false)
    expect(validateValues([])).toBe(false)
  })
})
