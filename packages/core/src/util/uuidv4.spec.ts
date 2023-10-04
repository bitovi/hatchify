import { getCrypto, uuidv4 } from "./uuidv4"

describe("uuidv4", () => {
  it("generates a uuid", () => {
    expect(uuidv4()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    )
  })
})

describe("getCrypto", () => {
  /* eslint-disable */
  it("returns node crypto if available", () => {
    expect(getCrypto()).toBe(require("crypto"))
  })

  it("returns window.crypto if available", () => {
    const originalProcess = process
    // @ts-ignore
    global.window = { crypto: "window.crypto" }
    // @ts-ignore
    process = undefined

    expect(getCrypto()).toBe("window.crypto")

    // @ts-ignore
    global.window = undefined
    process = originalProcess
  })
  /* eslint-enable */
})
