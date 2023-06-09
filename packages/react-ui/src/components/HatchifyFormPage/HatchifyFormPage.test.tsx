import { describe, it, vi } from "vitest"
import { render } from "@testing-library/react"
import { HatchifyFormPage } from "./HatchifyFormPage"
// import type { Schema } from "@hatchifyjs/rest-client"
import type { Schema } from "../../services-legacy/api/schemas" //TODO update schema

const TestSchema: Schema = {
  name: "Test",
  attributes: { id: "string", name: "string" },
  displayField: "name",
  jsonApiField: "tests",
}

describe("hatchifyjs/components/HatchifyFormPage", () => {
  it("works", () => {
    render(<HatchifyFormPage schema={TestSchema} routeOnSuccess={vi.fn()} />)
  })
})
