import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { assembler, string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"
import { default as MuiEverything } from "./MuiEverything.js"

describe("components/MuiList", () => {
  beforeAll(() => {
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))
  })

  const partialSchemas = {
    User: {
      name: "User",
      ui: { displayAttribute: "firstName" },
      attributes: {
        firstName: string(),
        lastName: string(),
      },
    },
  } satisfies Record<string, PartialSchema>

  const finalSchemas = assembler(partialSchemas)

  const data = [
    { id: "uuid1", firstName: "John", lastName: "Smith" },
    { id: "uuid2", firstName: "Jane", lastName: "Doe" },
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

  it("Works", async () => {
    render(
      <MuiEverything
        // @ts-expect-error
        data={data}
        setSelectedSchema={vi.fn()}
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
    expect(await screen.findByText("Jane")).toBeInTheDocument()
    expect(await screen.findByText("Doe")).toBeInTheDocument()
  })

  it("Works when no schema is present", async () => {
    render(
      <MuiEverything
        data={undefined}
        setSelectedSchema={vi.fn()}
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
        finalSchemas={undefined}
        partialSchemas={undefined}
        schemaName="User"
        fields={{}}
        include={[]}
        filter={[{ field: "name", value: "wash car", operator: "equals" }]}
        setFilter={vi.fn()}
      />,
    )

    expect(await screen.findByText("There are no schemas.")).toBeInTheDocument()

    const schemaLink = await screen.findByRole("link")
    expect(schemaLink).toBeInTheDocument()
    expect(schemaLink).toHaveTextContent("Create some to get started!")
  })
  it("Shows no records found when there is no data", async () => {
    render(
      <MuiEverything
        data={[]}
        setSelectedSchema={vi.fn()}
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

    expect(
      await screen.findByText("No records found. Create some to get started."),
    ).toBeInTheDocument()
  })
})
