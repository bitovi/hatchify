import { describe, it, expect } from "vitest"

import { render, screen } from "@testing-library/react"
import {MuiLayout} from "./MuiLayout"
import type { Schema } from "data-core"

const TestSchema: Schema = {
  name: "Test",
  attributes: { id: "string", name: "string" },
  displayAttribute: "name"
}

describe("hatchifyjs/presentation/mui/MuiLayout", () => {
  describe("MuiLayout", () => {
    it("works", async () => {
      render(<MuiLayout schema={TestSchema} />)
      expect(await screen.findByText("Test")).toBeDefined()
    })
  })
})
