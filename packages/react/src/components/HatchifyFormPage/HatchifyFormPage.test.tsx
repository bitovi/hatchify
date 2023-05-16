import { describe, it, vi } from "vitest"
import { render } from "@testing-library/react"
import {HatchifyFormPage} from "./HatchifyFormPage"
import type { Schema } from "data-core"

const TestSchema: Schema = {
  name: "Test",
  attributes: { id: "string", name: "string" },
  displayAttribute: "name",
}

describe("hatchifyjs/components/HatchifyFormPage", () => {
  it("works", () => {
    render(<HatchifyFormPage schema={TestSchema} routeOnSuccess={vi.fn()} />)
  })
})
