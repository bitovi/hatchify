import { describe, it, vi } from "vitest"
import { render } from "@testing-library/react"

import { HatchifyForm } from "./HatchifyForm"
// import type { Schema } from "@hatchifyjs/rest-client"
import type { Schema } from "../../services/api/schemas" //TODO update schema

const TestSchema: Schema = {
  name: "Test",
  attributes: { id: "string", name: "string" },
  displayField: "name",
  jsonApiField: "tests",
}

describe("hatchifyjs/components/HatchifyForm", () => {
  it("works", () => {
    render(<HatchifyForm schema={TestSchema} routeOnSuccess={vi.fn()} />)
  })
})
