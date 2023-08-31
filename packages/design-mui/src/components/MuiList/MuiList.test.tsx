import "@testing-library/jest-dom"
import { createElement } from "react"
import { render, screen, within } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { assembler, integer } from "@hatchifyjs/hatchify-core"
import { MuiList } from "./MuiList"

describe("components/MuiList", () => {
  const partialSchemas = {
    User: {
      name: "User",
      displayAttribute: "firstName",
      attributes: {
        // todo: change back to strings when v2 supports strings
        firstName: integer(),
        lastName: integer(),
      },
    },
  }

  const finalSchemas = assembler(partialSchemas)

  // todo: change back to strings when v2 supports strings
  const data = [
    {
      id: "uuid1",
      firstName: 5,
      lastName: 15,
    },
    { id: "uuid2", firstName: 25, lastName: 30 },
  ]

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

  it("works", async () => {
    render(
      <MuiList
        data={data}
        meta={meta}
        sort={{
          direction: undefined,
          sortBy: undefined,
        }}
        setSort={vi.fn()}
        page={{ number: 1, size: 10 }}
        setPage={vi.fn()}
        selected={{ all: false, ids: [] }}
        setSelected={vi.fn()}
        finalSchemas={finalSchemas}
        partialSchemas={partialSchemas}
        schemaName="User"
        fields={{}}
        include={[]}
        filter={[{ field: "name", value: "wash car", operator: "equals" }]}
        setFilter={vi.fn()}
      />,
    )

    expect(await screen.findByText("FirstName")).toBeInTheDocument()
    expect(await screen.findByText("LastName")).toBeInTheDocument()
    expect(await screen.findByText("5")).toBeInTheDocument()
    expect(await screen.findByText("15")).toBeInTheDocument()
    expect(await screen.findByText("25")).toBeInTheDocument()
    expect(await screen.findByText("30")).toBeInTheDocument()
  })

  it("fires sort callback", async () => {
    const setSort = vi.fn()

    render(
      <MuiList
        data={data}
        meta={meta}
        sort={{
          direction: undefined,
          sortBy: undefined,
        }}
        setSort={setSort}
        page={{ number: 1, size: 10 }}
        setPage={vi.fn()}
        selected={{ all: false, ids: [] }}
        setSelected={vi.fn()}
        finalSchemas={finalSchemas}
        partialSchemas={partialSchemas}
        schemaName="User"
        fields={{}}
        include={[]}
        filter={[{ field: "name", value: "wash car", operator: "equals" }]}
        setFilter={vi.fn()}
      />,
    )

    await screen.findByText("FirstName").then((el) => el.click())
    await screen.findByText("LastName").then((el) => el.click())

    expect(setSort.mock.calls).toEqual([["firstName"], ["lastName"]])
  })

  describe("fires checkbox callbacks", async () => {
    const setSelected = vi.fn()

    const renderWithSelected = (selected: { all: boolean; ids: string[] }) =>
      render(
        <MuiList
          data={data}
          meta={meta}
          sort={{
            direction: undefined,
            sortBy: undefined,
          }}
          setSort={() => vi.fn()}
          page={{ number: 1, size: 10 }}
          setPage={vi.fn()}
          selected={selected}
          setSelected={setSelected}
          finalSchemas={finalSchemas}
          partialSchemas={partialSchemas}
          schemaName="User"
          fields={{}}
          include={[]}
          filter={[{ field: "name", value: "wash car", operator: "equals" }]}
          setFilter={vi.fn()}
        />,
      )

    it("selects all", async () => {
      renderWithSelected({ all: false, ids: [] })

      within(await screen.findByLabelText("select all"))
        .getByRole("checkbox")
        .click()

      expect(setSelected).toHaveBeenCalledWith({
        all: true,
        ids: ["uuid1", "uuid2"],
      })
    })

    it("deselects all", async () => {
      renderWithSelected({ all: true, ids: ["uuid1", "uuid2"] })

      within(await screen.findByLabelText("select all"))
        .getByRole("checkbox")
        .click()

      expect(setSelected).toHaveBeenCalledWith({ all: false, ids: [] })
    })

    it("selects one", async () => {
      renderWithSelected({ all: false, ids: [] })

      within(await screen.findByLabelText("select uuid1"))
        .getByRole("checkbox")
        .click()

      expect(setSelected).toHaveBeenCalledWith({ all: false, ids: ["uuid1"] })
    })

    it("selects an additional row", async () => {
      renderWithSelected({ all: false, ids: ["uuid1"] })

      within(await screen.findByLabelText("select uuid2"))
        .getByRole("checkbox")
        .click()

      expect(setSelected).toHaveBeenCalledWith({
        all: false,
        ids: ["uuid1", "uuid2"],
      })
    })

    it("deselects one", async () => {
      renderWithSelected({ all: true, ids: ["uuid1", "uuid2"] })

      within(await screen.findByLabelText("select uuid1"))
        .getByRole("checkbox")
        .click()

      expect(setSelected).toHaveBeenCalledWith({ all: false, ids: ["uuid2"] })
    })
  })

  it("displays Empty component if there is no data", async () => {
    const Empty = () => <div>so empty inside</div>

    render(
      <MuiList
        data={[]}
        meta={meta}
        sort={{
          direction: undefined,
          sortBy: undefined,
        }}
        setSort={() => vi.fn()}
        page={{ number: 1, size: 10 }}
        setPage={vi.fn()}
        selected={{ all: false, ids: [] }}
        setSelected={vi.fn()}
        finalSchemas={finalSchemas}
        partialSchemas={partialSchemas}
        schemaName="User"
        fields={{}}
        include={[]}
        filter={[{ field: "name", value: "wash car", operator: "equals" }]}
        setFilter={vi.fn()}
      >
        {createElement(Empty, {}, <div>so empty inside</div>)}
      </MuiList>,
    )

    expect(await screen.findByText("so empty inside")).toBeInTheDocument()
  })
})
