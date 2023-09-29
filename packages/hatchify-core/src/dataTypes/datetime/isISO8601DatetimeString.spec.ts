import { isISO8601DatetimeString } from "./isISO8601DatetimeString"

describe("isISO8601DatetimeString", () => {
  it("validates date strings correctly", () => {
    expect(isISO8601DatetimeString("2011-10-05T14:48:00.000Z")).toBe(true)
    expect(isISO8601DatetimeString("2018-11-10T11:22:33+00:00")).toBe(false)
    expect(isISO8601DatetimeString("2011-10-05T14:99:00.000Z")).toBe(false)
  })
})
