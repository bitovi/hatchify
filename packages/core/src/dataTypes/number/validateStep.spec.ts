import { validateStep } from "./validateStep.js"

describe("validateStep", () => {
  it("without step", () => {
    expect(validateStep(0)).toBe(true)
    expect(validateStep(1)).toBe(true)
    expect(validateStep(0.1)).toBe(true)
    expect(validateStep(-0.1)).toBe(true)
    expect(validateStep(0.11)).toBe(true)
    expect(validateStep(-0.11)).toBe(true)
    expect(validateStep(null as unknown as number)).toBe(false)
    expect(validateStep(undefined as unknown as number)).toBe(false)
  })

  it("without minimum", () => {
    const step = 0.1

    expect(validateStep(0, step)).toBe(true)
    expect(validateStep(1, step)).toBe(true)
    expect(validateStep(0.1, step)).toBe(true)
    expect(validateStep(-0.1, step)).toBe(true)
    expect(validateStep(0.11, step)).toBe(false)
    expect(validateStep(-0.11, step)).toBe(false)
    expect(validateStep(null as unknown as number, step)).toBe(false)
    expect(validateStep(undefined as unknown as number, step)).toBe(false)
  })

  it("with minimum", () => {
    const step = 0.1
    const min = -0.01

    // ..., -1.11, -1.01, ..., -0.21, -0.11, -0.01, 0.09, 0.19,...

    expect(validateStep(0, step, min)).toBe(false)
    expect(validateStep(1, step, min)).toBe(false)
    expect(validateStep(0.1, step, min)).toBe(false)
    expect(validateStep(-0.1, step, min)).toBe(false)
    expect(validateStep(0.09, step, min)).toBe(true)
    expect(validateStep(0.11, step, min)).toBe(false)
    expect(validateStep(0.19, step, min)).toBe(true)
    expect(validateStep(-0.11, step, min)).toBe(true)
    expect(validateStep(0.01, step, min)).toBe(false)
    expect(validateStep(1.01, step, min)).toBe(false)
    expect(validateStep(0.111, step, min)).toBe(false)
    expect(validateStep(-0.111, step, min)).toBe(false)
    expect(validateStep(null as unknown as number, step, min)).toBe(false)
    expect(validateStep(undefined as unknown as number, step, min)).toBe(false)
  })
})
