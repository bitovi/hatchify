import crypto from "node:crypto"

import { getCrypto, uuidv4 } from "./uuidv4.js"

describe("uuidv4", () => {
  it("generates a uuid", () => {
    expect(uuidv4()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    )
  })
})

describe("getCrypto", () => {
  it("returns node crypto if available", async () => {
    expect(getCrypto()).toBe(crypto.webcrypto)
  })
})
