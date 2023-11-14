import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { string } from "@hatchifyjs/core"
import { MuiLayout } from "./MuiLayout"

const partialSchemas = {
  Todo: {
    name: "Todo",
    attributes: { name: string() },
  },
}

describe("hatchifyjs/presentation/mui/MuiLayout", () => {
  describe("MuiLayout", () => {
    it("works", async () => {
      render(<MuiLayout partialSchemas={partialSchemas} schemaName="Todo" />)
      expect(await screen.findByText("Todo")).toBeDefined()
    })
  })
})
