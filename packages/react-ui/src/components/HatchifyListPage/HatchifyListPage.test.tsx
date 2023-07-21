import { describe, it, vi } from "vitest"

import { render } from "@testing-library/react"
import { HatchifyListPage } from "./HatchifyListPage"
import type { Schema } from "../../services-legacy/api/schemas" //TODO update schema

const LegacySchema: Schema = {
  name: "Test",
  attributes: { id: "string", name: "string" },
  displayField: "name",
  jsonApiField: "tests",
}

const FutureSchema = {
  name: "Test",
  attributes: { id: "string", name: "string" },
  displayAttribute: "name",
}

describe("hatchifyjs/components/HatchifyListPage", () => {
  describe("HatchifyListPage", () => {
    it("works", () => {
      render(
        <HatchifyListPage
          schema={LegacySchema}
          allSchemas={{ Test: FutureSchema }}
          schemaName="Test"
          useData={vi.fn()}
          filter={{}}
        />,
      )
    })
  })
})
