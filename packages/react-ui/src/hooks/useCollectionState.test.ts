import { describe, expect, it, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { assembler, integer } from "@hatchifyjs/core"
import hatchifyReactRest from "@hatchifyjs/react-rest"
import useCollectionState from "./useCollectionState"

const partialSchemas = {
  Todo: {
    name: "Todo",
    attributes: {
      importance: integer(),
    },
  },
}

const finalSchemas = assembler(partialSchemas)

const fakeRestClient = hatchifyReactRest({
  version: 0,
  completeSchemaMap: partialSchemas,
  findAll: () =>
    Promise.resolve([
      {
        records: [
          {
            id: "1",
            __schema: "Todo",
            attributes: { name: "foo", created: "2021-01-01", important: true },
          },
        ],
        related: [],
      },
      {
        unpaginatedCount: 1,
      },
    ]),
  findOne: () => Promise.resolve({ record: {} as any, related: [] }),
  createOne: () => Promise.resolve({ record: {} as any, related: [] }),
  updateOne: () => Promise.resolve({ record: {} as any, related: [] }),
  deleteOne: () => Promise.resolve(),
})

describe("useCollectionState", () => {
  it("works", async () => {
    const { result } = renderHook(() =>
      useCollectionState(finalSchemas, partialSchemas, "Todo", fakeRestClient, {
        defaultSelected: { all: false, ids: [] },
        onSelectedChange: vi.fn(),
        defaultPage: { size: 1, number: 2 },
        defaultSort: { direction: "desc", sortBy: "id" },
        baseFilter: [{ field: "id", value: "1", operator: "$eq" }],
      }),
    )

    const expected = {
      data: [
        {
          __schema: "Todo",
          id: "1",
          name: "foo",
          created: "2021-01-01",
          important: true,
        },
      ],
      meta: {
        error: undefined,
        isDone: true,
        isLoading: false,
        isRejected: false,
        isRevalidating: false,
        isStale: false,
        isSuccess: true,
        meta: {
          unpaginatedCount: 1,
        },
        status: "success",
      },
      fields: undefined,
      include: undefined,
      page: { size: 1, number: 2 },
      setPage: expect.any(Function),
      sort: { direction: "desc", sortBy: "id" },
      setSort: expect.any(Function),
      selected: {
        all: false,
        ids: [],
      },
      setSelected: expect.any(Function),
      finalSchemas,
      partialSchemas,
      schemaName: "Todo",
      filter: undefined,
      setFilter: expect.any(Function),
    }

    await waitFor(() => {
      expect(result.current).toEqual({
        ...expected,
      })
    })

    await waitFor(() => {
      result.current.setPage({ size: 10, number: 2 })
    })

    await waitFor(() => {
      expect(result.current).toEqual({
        ...expected,
        page: {
          size: 10,
          number: 2,
        },
      })
    })

    await waitFor(() => {
      result.current.setSort("name")
    })

    await waitFor(() => {
      expect(result.current).toEqual({
        ...expected,
        page: {
          size: 10,
          number: 2,
        },
        sort: {
          direction: "asc",
          sortBy: "name",
        },
      })
    })

    await waitFor(() => {
      result.current.setSort("name")
    })

    await waitFor(() => {
      expect(result.current).toEqual({
        ...expected,
        page: {
          size: 10,
          number: 2,
        },
        sort: {
          direction: "desc",
          sortBy: "name",
        },
      })
    })

    await waitFor(() => {
      if (result.current.setSelected !== undefined) {
        result.current.setSelected({ all: false, ids: ["1", "2"] })
      }
    })

    await waitFor(() => {
      expect(result.current).toEqual({
        ...expected,
        page: {
          size: 10,
          number: 2,
        },
        sort: {
          direction: "desc",
          sortBy: "name",
        },
        selected: { all: false, ids: ["1", "2"] },
      })
    })
  })
})
