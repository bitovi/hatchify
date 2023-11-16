import { describe, it, expect } from "vitest"
import { getEmptyList } from "."

describe("hooks/useCompoundComponents/helpers/getEmptyList", () => {
  it.todo("works when valid children are passed", () => {
    // When using `HatchifyEmpty` in this test, it is filtered out because in
    // the test environemnt it's name property is resolving to `HatchifyEmpty`
    // and not `Empty`. This is not an issue when  running outside of a test
    // environment.
  })

  it("falls back to default EmptyList", () => {
    const EmptyList = getEmptyList([])

    expect(EmptyList).toBeInstanceOf(Function)
    expect(EmptyList()).toMatchInlineSnapshot(`
      <div>
        No records found
      </div>
    `)
  })
})
