import { uuidv4 } from "./uuidv4"

describe("uuidv4", () => {
  it("generates a uuid", () => {
    expect(uuidv4()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    )
  })
})
