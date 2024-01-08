import { validateStep } from "./validateStep.js"

describe("validateStep", () => {
  it("without step", () => {
    expect(validateStep(new Date())).toBe(true)
    expect(validateStep(null as unknown as Date)).toBe(false)
    expect(validateStep(undefined as unknown as Date)).toBe(false)
  })

  it("without minimum", () => {
    const step = 86400000 // day

    expect(validateStep(new Date("2023-01-01T00:00:00.000Z"), step)).toBe(true)
    expect(validateStep(new Date("2023-01-01T01:00:00.000Z"), step)).toBe(false)
    expect(validateStep(null as unknown as Date, step)).toBe(false)
    expect(validateStep(undefined as unknown as Date, step)).toBe(false)
  })

  it("with minimum", () => {
    const step = 86400000 // day
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
})
