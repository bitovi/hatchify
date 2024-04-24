import { ensureDefaultReadOnlyAttribute } from "./ensureDefaultReadOnlyAttribute.js"
import { string } from "../dataTypes/index.js"

describe("ensureDefaultReadOnlyAttribute", () => {
  it("handles existing read-only schema", () => {
    expect(
      JSON.stringify(
        ensureDefaultReadOnlyAttribute({
          name: "Todo",
          attributes: {
            name: string({ readOnly: true }),
            description: string(),
          },
          readOnly: true,
        }),
      ),
    ).toEqual(
      JSON.stringify({
        name: "Todo",
        attributes: {
          name: string({ readOnly: true }),
          description: {
            ...string({ readOnly: true }),
            name: "string()",
          },
        },
        readOnly: true,
      }),
    )
  })
})
