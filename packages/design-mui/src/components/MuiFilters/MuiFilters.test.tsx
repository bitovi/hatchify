import "@testing-library/jest-dom"
import { describe, it, expect, vi } from "vitest"
import { render, screen, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import MuiFilters from "./MuiFilters"
import { assembler } from "@hatchifyjs/hatchify-core"

const finalSchemas = assembler({
  Test: {
    name: "Test",
    attributes: { id: "string", name: "string" },
  },
})

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
        finalSchemas={finalSchemas}
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

  it("sets page number back to 1 when the filter is applied", async () => {
    const setPage = vi.fn()

    const setFilters = vi.fn()

    vi.useFakeTimers({ shouldAdvanceTime: true })

    render(
      <MuiFilters
        finalSchemas={finalSchemas}
        schemaName="Test"
        data={[]}
        meta={meta}
        sort={{
          direction: undefined,
          sortBy: undefined,
        }}
        page={{ number: 2, size: 10 }}
        fields={{}}
        include={[]}
        setSort={vi.fn()}
        setPage={(val) => setPage(val)}
        selected={{ all: false, ids: [] }}
        setSelected={vi.fn()}
        filter={undefined}
        setFilter={(val) => setFilters(val)}
      />,
    )

    const filter = await screen.findByTestId("FilterListIcon")

    await userEvent.click(filter)

    const textField = await screen.findByPlaceholderText("Filter Value")
    await userEvent.click(textField)
    await userEvent.keyboard("was")
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(setFilters).toHaveBeenCalledWith([
      { field: "id", operator: "ilike", value: "was" },
    ])
    expect(setPage).toHaveBeenCalledWith({ number: 1, size: 10 })
    vi.useRealTimers()
  })
})
