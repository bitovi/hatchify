import { isISO8601DateString } from "./isISO8601DateString.js"

describe("isISO8601DateString", () => {
  it("validates date strings correctly", () => {
    expect(isISO8601DateString("2011-10-05")).toBe(true)
    expect(isISO8601DateString("")).toBe(false)
    expect(isISO8601DateString("2011-10-05T14:48:00.000Z")).toBe(false)
    expect(isISO8601DateString("2018-11-10T11:22:33+00:00")).toBe(false)
    expect(isISO8601DateString("2011-10-05T14:99:00.000Z")).toBe(false)
  })
})
