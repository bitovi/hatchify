import "@testing-library/jest-dom"
import { createElement } from "react"
import { render, screen, within } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { assembler, string, text } from "@hatchifyjs/core"
import { MuiList } from "./MuiList.js"

describe("components/MuiList", () => {
  const partialSchemas = {
    User: {
      name: "User",
      displayAttribute: "firstName",
      attributes: {
        firstName: string(),
        lastName: string({ maxRenderLength: 5 }),
        role: text({ maxRenderLength: 10 }),
        status: text(),
      },
    },
  }

  const finalSchemas = assembler(partialSchemas)

  const data = [
    {
      id: "uuid1",
      firstName: "John",
      lastName: "Smith",
      role: "Accountant",
      status: "AFK",
    },
    {
      id: "uuid2",
      firstName: "George",
      lastName: "Washington",
      role: "Software Engineer",
      status: "In a meeting",
    },
  ]

  const meta = {
    status: "success",
    meta: {
      unpaginatedCount: 30, // 3 pages
    },
    error: undefined,
    isResolved: true,
    isPending: false,
    isRejected: false,
    isRevalidating: false,
    isStale: false,
    isSuccess: true,
  } as any

  it("works", async () => {
    render(
      <MuiList<typeof partialSchemas, "User">
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

    expect(await screen.findByText("First Name")).toBeInTheDocument()
    expect(await screen.findByText("Last Name")).toBeInTheDocument()
    expect(await screen.findByText("John")).toBeInTheDocument()
    expect(await screen.findByText("Smith")).toBeInTheDocument()
    expect(await screen.findByText("Accountant")).toBeInTheDocument()
    expect(await screen.findByText("AFK")).toBeInTheDocument()
    expect(await screen.findByText("George")).toBeInTheDocument()
    expect(await screen.findByText("Washi\u2026")).toBeInTheDocument()
    expect(await screen.findByText("Software E\u2026")).toBeInTheDocument()
    expect(await screen.findByText("In a meeting")).toBeInTheDocument()
  })

  it("fires sort callback", async () => {
    const setSort = vi.fn()

    render(
      <MuiList<typeof partialSchemas, "User">
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

    await screen.findByText("First Name").then((el) => el.click())
    await screen.findByText("Last Name").then((el) => el.click())

    expect(setSort.mock.calls).toEqual([["firstName"], ["lastName"]])
  })

  describe("fires checkbox callbacks", async () => {
    const setSelected = vi.fn()

    const renderWithSelected = (selected: { all: boolean; ids: string[] }) =>
      render(
        <MuiList<typeof partialSchemas, "User">
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
      <MuiList<typeof partialSchemas, "User">
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
