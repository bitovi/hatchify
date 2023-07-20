import { describe, it, vi } from "vitest"
import { render } from "@testing-library/react"

import { HatchifyFilter } from "./HatchifyFilter"
import type { Schema } from "@hatchifyjs/rest-client"

const TestSchema: Schema = {
  name: "Test",
  attributes: { id: "string", name: "string" },
  displayAttribute: "name",
}

describe("hatchifyjs/components/HatchifyFilter", () => {
  describe("HatchifyFilter", () => {
    it("works", async () => {
      render(
        <HatchifyFilter
          allSchemas={{ Test: TestSchema }}
          schemaName="Test"
          filters={{}}
          setFilters={vi.fn()}
        >
          <div data-testid="FilterButton">filter</div>
        </HatchifyFilter>,
      )
    })
  })
})
