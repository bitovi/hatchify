import { validateStep } from "./validateStep.js"
import { HatchifyCoerceError } from "../../types/index.js"

describe("validateStep", () => {
  it("without step", () => {
    expect(validateStep(new Date("2023-01-01T00:00:00.000Z"))).toBe(true)
    expect(validateStep(null as unknown as Date)).toBe(false)
    expect(validateStep(undefined as unknown as Date)).toBe(false)
  })

  it("without minimum", () => {
    const step = "day"

    expect(validateStep(new Date("2023-01-01T00:00:00.000Z"), step)).toBe(true)
    expect(validateStep(new Date("2023-01-01T01:00:00.000Z"), step)).toBe(false)
    expect(validateStep(null as unknown as Date, step)).toBe(false)
    expect(validateStep(undefined as unknown as Date, step)).toBe(false)
  })

  it("with minimum", () => {
    const step = "day"
    const min = new Date("2023-01-01T01:00:00.000Z")

    expect(validateStep(new Date("2023-01-01T00:00:00.000Z"), step, min)).toBe(
      false,
    )
    expect(validateStep(new Date("2023-01-01T01:00:00.000Z"), step, min)).toBe(
      true,
    )
    expect(validateStep(new Date("2023-01-02T00:00:00.000Z"), step, min)).toBe(
      false,
    )
    expect(validateStep(new Date("2023-01-02T01:00:00.000Z"), step, min)).toBe(
      true,
    )
    expect(validateStep(null as unknown as Date, step, min)).toBe(false)
    expect(validateStep(undefined as unknown as Date, step, min)).toBe(false)
  })

  it("with invalid step", () => {
    expect(() =>
      validateStep(new Date(), "invalid" as unknown as number),
    ).toThrow(
      new HatchifyCoerceError('as one of "day", "week", "year", "decade"'),
    )
  })
})
