import type { Schema } from "@hatchifyjs/rest-client"
import "@testing-library/jest-dom"
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import MuiFilters from "./MuiFilters"

const TestSchema: Schema = {
  name: "Test",
  attributes: { id: "string", name: "string" },
  displayAttribute: "name",
}

const meta = {
  status: "success",
  meta: {
    unpaginatedCount: 30, // 3 pages
  },
  error: undefined,
  isDone: true,
  isLoading: false,
  isRejected: false,
  isRevalidating: false,
  isStale: false,
  isSuccess: true,
} as any

describe("components/MuiFilters", () => {
  it("works", async () => {
    render(
      <MuiFilters
        allSchemas={{ Test: TestSchema }}
        schemaName="Test"
        data={[]}
        meta={meta}
        sort={{
          direction: undefined,
          sortBy: undefined,
        }}
        page={{ number: 1, size: 10 }}
        fields={{}}
        include={[]}
        setSort={vi.fn()}
        setPage={vi.fn()}
        selected={{ all: false, ids: [] }}
        setSelected={vi.fn()}
        filter={[{ field: "name", value: "wash car", operator: "equals" }]}
        setFilter={vi.fn()}
      />,
    )

    const filter = await screen.findByTestId("FilterListIcon")

    expect(screen.queryByText("Column")).not.toBeInTheDocument()
    expect(screen.queryByText("Operator")).not.toBeInTheDocument()
    expect(screen.queryByText("Value")).not.toBeInTheDocument()

    await userEvent.click(filter)

    expect(await screen.findByText("Column")).toBeInTheDocument()
    expect(await screen.findByText("Operator")).toBeInTheDocument()
    expect(await screen.findByText("Value")).toBeInTheDocument()
  })
})
