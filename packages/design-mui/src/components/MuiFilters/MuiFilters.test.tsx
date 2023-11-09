import "@testing-library/jest-dom"
import { describe, it, expect, vi } from "vitest"
import { render, screen, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import MuiFilters from "./MuiFilters"
import {
  assembler,
  belongsTo,
  hasMany,
  integer,
  string,
} from "@hatchifyjs/core"

const partialSchemas = {
  Todo: {
    name: "Todo",
    attributes: { name: string(), id: integer() },
    relationships: { user: belongsTo() },
  },
  User: {
    name: "User",
    attributes: { name: string() },
    relationships: { todo: hasMany() },
  },
}
const finalSchemas = assembler(partialSchemas)

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

// todo: v2 schema only supports numbers, filter does not support numbers
describe("components/MuiFilters", () => {
  it("works", async () => {
    render(
      <MuiFilters
        finalSchemas={finalSchemas}
        partialSchemas={partialSchemas}
        schemaName="Todo"
        data={[]}
        meta={meta}
        sort={{
          direction: undefined,
          sortBy: undefined,
        }}
        page={{ number: 1, size: 10 }}
        fields={{}}
        include={["user"]}
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
        partialSchemas={partialSchemas}
        schemaName="Todo"
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
      { field: "name", operator: "icontains", value: "was" },
    ])
    expect(setPage).toHaveBeenCalledWith({ number: 1, size: 10 })
    vi.useRealTimers()
  })

  it("Sets filter if value is empty and the operator is an empty type", async () => {
    const setPage = vi.fn()

    const setFilters = vi.fn()

    vi.useFakeTimers({ shouldAdvanceTime: true })

    render(
      <MuiFilters
        finalSchemas={finalSchemas}
        partialSchemas={partialSchemas}
        schemaName="Todo"
        data={[]}
        meta={meta}
        sort={{
          direction: undefined,
          sortBy: undefined,
        }}
        page={{ number: 2, size: 10 }}
        fields={{}}
        include={["user"]}
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

    const dropdownContainer = screen.getByTestId("operator-select")
    const dropdown = dropdownContainer.querySelector("div") // eslint-disable-line testing-library/no-node-access
    await userEvent.click(dropdown as any)
    const emptySelection = screen.getByText("is empty")
    await userEvent.click(emptySelection)

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(setFilters).toHaveBeenCalledWith([
      { field: "name", operator: "empty", value: "" },
    ])
    expect(setPage).toHaveBeenCalledWith({ number: 1, size: 10 })
    vi.useRealTimers()
  })

  it("Removes filter if value is empty and the operator is not an empty type", async () => {
    const setPage = vi.fn()

    const setFilters = vi.fn()

    vi.useFakeTimers({ shouldAdvanceTime: true })

    render(
      <MuiFilters
        finalSchemas={finalSchemas}
        partialSchemas={partialSchemas}
        schemaName="Todo"
        data={[]}
        meta={meta}
        sort={{
          direction: undefined,
          sortBy: undefined,
        }}
        page={{ number: 2, size: 10 }}
        fields={{}}
        include={["user"]}
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

    const dropdownContainer = screen.getByTestId("operator-select")
    const dropdown = dropdownContainer.querySelector("div") // eslint-disable-line testing-library/no-node-access
    await userEvent.click(dropdown as any)
    const emptySelection = screen.getByText("equals")
    await userEvent.click(emptySelection)

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(setFilters).toHaveBeenCalledWith(undefined)
    expect(setPage).toHaveBeenCalledTimes(0)
    vi.useRealTimers()
  })

  it("adds a new filter row when Add Filter is clicked", async () => {
    const setPage = vi.fn()

    render(
      <MuiFilters
        finalSchemas={finalSchemas}
        partialSchemas={partialSchemas}
        schemaName="Todo"
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
        setFilter={(val) => vi.fn()}
      />,
    )

    const filter = await screen.findByTestId("FilterListIcon")

    await userEvent.click(filter)
    let closeIcons = screen.getAllByTestId("CloseIcon")

    //There is only one filter row at first
    expect(closeIcons.length).toEqual(1)

    const addFilterButton = screen.getByText("Add Filter")
    await userEvent.click(addFilterButton)

    //second row has been added
    closeIcons = screen.getAllByTestId("CloseIcon")
    expect(closeIcons.length).toEqual(2)
  })

  it("Clears rows and closes filter when Remove All is selected", async () => {
    const setPage = vi.fn()

    const setFilters = vi.fn()

    vi.useFakeTimers({ shouldAdvanceTime: true })

    render(
      <MuiFilters
        finalSchemas={finalSchemas}
        partialSchemas={partialSchemas}
        schemaName="Todo"
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
    const closeIcons = screen.getAllByTestId("CloseIcon")

    //There is only one filter row at first
    expect(closeIcons.length).toEqual(1)

    const removeAllButton = screen.getByText("Remove All")
    await userEvent.click(removeAllButton)

    act(() => {
      vi.advanceTimersByTime(500)
    })

    //filter is closed
    const noRemoveAllButton = screen.queryByText("Remove All")
    expect(noRemoveAllButton).toBeNull()
    expect(setFilters).toHaveBeenCalled()

    vi.useRealTimers()
  })

  it("Closes filter component if only row is closed", async () => {
    const setPage = vi.fn()

    const setFilters = vi.fn()

    vi.useFakeTimers({ shouldAdvanceTime: true })

    render(
      <MuiFilters
        finalSchemas={finalSchemas}
        partialSchemas={partialSchemas}
        schemaName="Todo"
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
    const closeIcons = screen.getAllByTestId("CloseIcon")

    //There is only one filter row at first
    expect(closeIcons.length).toEqual(1)
    await userEvent.click(closeIcons[0])

    act(() => {
      vi.advanceTimersByTime(500)
    })

    //filter is closed
    const noRemoveAllButton = screen.queryByText("Remove All")
    expect(noRemoveAllButton).toBeNull()
    expect(setFilters).toHaveBeenCalled()

    vi.useRealTimers()
  })

  it("Only removes one row if a close button is clicked", async () => {
    const setPage = vi.fn()

    const setFilters = vi.fn()

    vi.useFakeTimers({ shouldAdvanceTime: true })

    render(
      <MuiFilters
        finalSchemas={finalSchemas}
        partialSchemas={partialSchemas}
        schemaName="Todo"
        data={[]}
        meta={meta}
        sort={{
          direction: undefined,
          sortBy: undefined,
        }}
        page={{ number: 2, size: 10 }}
        include={["user"]}
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
    let closeIcons = screen.getAllByTestId("CloseIcon")

    //There is only one filter row at first
    expect(closeIcons.length).toEqual(1)

    const addFilterButton = screen.getByText("Add Filter")
    await userEvent.click(addFilterButton)

    //second row has been added
    closeIcons = screen.getAllByTestId("CloseIcon")
    expect(closeIcons.length).toEqual(2)

    await userEvent.click(closeIcons[0])
    closeIcons = screen.getAllByTestId("CloseIcon")
    expect(closeIcons.length).toEqual(1)

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(setFilters).toHaveBeenCalled()

    vi.useRealTimers()
  })
})
