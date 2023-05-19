import { describe, it } from "vitest"

import { render } from "@testing-library/react"
import { HatchifyDetailsPage } from "./HatchifyDetailsPage"
import type { Schema } from "@hatchifyjs/data-core"

const TestSchema: Schema = {
  name: "Test",
  attributes: { id: "string", name: "string" },
  displayAttribute: "name",
}

describe("hatchifyjs/components/HatchifyDetailsPage", () => {
  describe("HatchifyDetailsPage", () => {
    it("works", () => {
      render(<HatchifyDetailsPage schema={TestSchema} />)
    })
  })
})
