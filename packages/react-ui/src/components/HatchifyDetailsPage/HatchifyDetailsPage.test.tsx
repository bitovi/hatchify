import { describe, it } from "vitest"

import { render } from "@testing-library/react"
import { HatchifyDetailsPage } from "./HatchifyDetailsPage"
// import type { Schema } from "@hatchifyjs/rest-client"
// import type { Schema } from "../../services-legacy/api/schemas" //TODO update schema
import type { Schema } from "../../services"

const TestSchema: Schema = {
  name: "Test",
  attributes: { id: "string", name: "string" },
  displayField: "name",
  jsonApiField: "tests",
}

describe("hatchifyjs/components/HatchifyDetailsPage", () => {
  describe("HatchifyDetailsPage", () => {
    it("works", () => {
      render(<HatchifyDetailsPage schema={TestSchema} />)
    })
  })
})
