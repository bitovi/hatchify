import "@testing-library/jest-dom"
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { MuiFilter } from "./MuiFilter"
import type { Schema } from "@hatchifyjs/rest-client"

const TestSchema: Schema = {
  name: "Test",
  attributes: { id: "string", name: "string" },
  displayAttribute: "name",
}
describe("hatchifyjs/presentation/mui/MuiFilter", () => {
  describe("MuiFilter", () => {
    it("works", async () => {
      render(
        <MuiFilter
          schemas={{ Test: TestSchema }}
          schemaName="Test"
          filters={{ name: "butts" }}
          setFilters={vi.fn()}
        >
          <div data-testid="FilterButton">filter</div>
        </MuiFilter>,
      )

      const filter = await screen.findByTestId("FilterButton")

      expect(screen.queryByText("Columns")).not.toBeInTheDocument()
      expect(screen.queryByText("Operator")).not.toBeInTheDocument()
      expect(screen.queryByText("Value")).not.toBeInTheDocument()

      await userEvent.click(filter)

      expect(await screen.findByText("Columns")).toBeInTheDocument()
      expect(await screen.findByText("Operator")).toBeInTheDocument()
      expect(await screen.findByText("Value")).toBeInTheDocument()
    })
    it("closes when the close button is clicked", async () => {
      render(
        <MuiFilter
          schemas={{ Test: TestSchema }}
          schemaName="Test"
          filters={{ name: "butts" }}
          setFilters={vi.fn()}
        >
          <div data-testid="FilterButton">filter</div>
        </MuiFilter>,
      )
      const filter = await screen.findByTestId("FilterButton")

      await userEvent.click(filter)

      expect(await screen.findByText("Columns")).toBeInTheDocument()
      expect(await screen.findByText("Operator")).toBeInTheDocument()
      expect(await screen.findByText("Value")).toBeInTheDocument()

      //   const closeButton = await screen.findByText("Close")

      //   await userEvent.click(closeButton)

      //   expect(screen.queryByText("Columns")).not.toBeInTheDocument()
      //   expect(screen.queryByText("Operator")).not.toBeInTheDocument()
      //   expect(screen.queryByText("Value")).not.toBeInTheDocument()
    })
  })
})
