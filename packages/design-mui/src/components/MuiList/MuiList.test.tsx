import "@testing-library/jest-dom"
import { createElement } from "react"
import { render, screen, within } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { MuiList } from "./MuiList"

describe("components/MuiList", () => {
  const schemas = {
    User: {
      name: "User",
      displayAttribute: "firstName",
      attributes: {
        firstName: "string",
        lastName: "string",
      },
    },
  }

  const data = [
    {
      id: "uuid1",
      firstName: "Joe",
      lastName: "Smith",
    },
    { id: "uuid2", firstName: "John", lastName: "Snow" },
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
        selected={[]}
        setSelected={vi.fn()}
        allSchemas={schemas}
        schemaName="User"
        fields={[]}
        include={[]}
        filter={[{ name: "wash car", operator: "equals" }]}
        setFilter={vi.fn()}
      />,
    )

    expect(await screen.findByText("FirstName")).toBeInTheDocument()
    expect(await screen.findByText("LastName")).toBeInTheDocument()
    expect(await screen.findByText("Joe")).toBeInTheDocument()
    expect(await screen.findByText("Smith")).toBeInTheDocument()
    expect(await screen.findByText("John")).toBeInTheDocument()
    expect(await screen.findByText("Snow")).toBeInTheDocument()
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
        selected={[]}
        setSelected={vi.fn()}
        allSchemas={schemas}
        schemaName="User"
        fields={[]}
        include={[]}
        filter={[{ name: "wash car", operator: "equals" }]}
        setFilter={vi.fn()}
      />,
    )

    await screen.findByText("FirstName").then((el) => el.click())
    await screen.findByText("LastName").then((el) => el.click())

    expect(setSort.mock.calls).toEqual([["firstName"], ["lastName"]])
  })

  describe("fires checkbox callbacks", async () => {
    const setSelected = vi.fn()

    const renderWithSelected = (selected: string[]) =>
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
          allSchemas={schemas}
          schemaName="User"
          fields={[]}
          include={[]}
          filter={[{ name: "wash car", operator: "equals" }]}
          setFilter={vi.fn()}
        />,
      )

    it("selects all", async () => {
      renderWithSelected([])

      within(await screen.findByLabelText("select all"))
        .getByRole("checkbox")
        .click()

      expect(setSelected).toHaveBeenCalledWith(["uuid1", "uuid2"])
    })

    it("deselects all", async () => {
      renderWithSelected(["uuid1", "uuid2"])

      within(await screen.findByLabelText("select all"))
        .getByRole("checkbox")
        .click()

      expect(setSelected).toHaveBeenCalledWith([])
    })

    it("selects one", async () => {
      renderWithSelected([])

      within(await screen.findByLabelText("select uuid1"))
        .getByRole("checkbox")
        .click()

      expect(setSelected).toHaveBeenCalledWith(["uuid1"])
    })

    it("selects an additional row", async () => {
      renderWithSelected(["uuid1"])

      within(await screen.findByLabelText("select uuid2"))
        .getByRole("checkbox")
        .click()

      expect(setSelected).toHaveBeenCalledWith(["uuid1", "uuid2"])
    })

    it("deselects one", async () => {
      renderWithSelected(["uuid1", "uuid2"])

      within(await screen.findByLabelText("select uuid1"))
        .getByRole("checkbox")
        .click()

      expect(setSelected).toHaveBeenCalledWith(["uuid2"])
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
        selected={[]}
        setSelected={vi.fn()}
        allSchemas={schemas}
        schemaName="User"
        fields={[]}
        include={[]}
        filter={[{ name: "wash car", operator: "equals" }]}
        setFilter={vi.fn()}
      >
        {createElement(Empty, {}, <div>so empty inside</div>)}
      </MuiList>,
    )

    expect(await screen.findByText("so empty inside")).toBeInTheDocument()
  })
})
