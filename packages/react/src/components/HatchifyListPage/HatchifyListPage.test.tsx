import { describe, it } from "vitest"

import { render } from "@testing-library/react"
import { HatchifyListPage } from "./HatchifyListPage"
// import type { Schema } from "@hatchifyjs/data-core"
import type { Schema } from "../../services/api/schemas" //TODO update schema

const TestSchema: Schema = {
  name: "Test",
  attributes: { id: "string", name: "string" },
  displayField: "name",
  jsonApiField: "tests",
}

describe("hatchifyjs/components/HatchifyListPage", () => {
  describe("HatchifyListPage", () => {
    it("works", () => {
      render(<HatchifyListPage schema={TestSchema} />)
    })
  })
})
