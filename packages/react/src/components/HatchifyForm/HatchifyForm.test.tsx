import { describe, it, vi } from "vitest"
import { render } from "@testing-library/react"

import {HatchifyForm} from "./HatchifyForm"
import type { Schema } from "data-core"

const TestSchema: Schema = {
  name: "Test",
  attributes: { id: "string", name: "string" },
  displayAttribute: "name",
}

describe("hatchifyjs/components/HatchifyForm", () => {
  it("works", () => {
    render(<HatchifyForm schema={TestSchema} routeOnSuccess={vi.fn()} />)
  })
})
