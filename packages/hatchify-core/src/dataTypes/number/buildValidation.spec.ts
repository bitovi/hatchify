import { buildValidation } from "./buildValidation"

describe("buildValidation", () => {
  it("handles no min and no max", () => {
    expect(buildValidation(undefined, undefined)).toEqual({})
  })

  it("handles min and no max", () => {
    expect(buildValidation(0, undefined)).toEqual({ validate: { min: 0 } })
  })

  it("handles max and no min", () => {
    expect(buildValidation(undefined, 0)).toEqual({ validate: { max: 0 } })
  })

  it("handles min and max", () => {
    expect(buildValidation(0, 0)).toEqual({ validate: { min: 0, max: 0 } })
  })
})
