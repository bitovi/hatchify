import { describe, it, expect } from "vitest"

import { render, screen } from "@testing-library/react"
import { MuiFilter } from "./MuiFilter"

import type { Schema } from "@hatchifyjs/react-ui"

const TestSchema: Schema = {
  name: "Test",
  attributes: { id: "string", name: "string" },
  displayField: "name",
  jsonApiField: "tests",
}

describe("hatchifyjs/presentation/mui/MuiFilter", () => {
  describe("MuiFilter", () => {
    it("works", async () => {
      render(<MuiFilter schemas={TestSchema} />)
      expect(await screen.findByText("Test")).toBeDefined()
    })
  })
})
