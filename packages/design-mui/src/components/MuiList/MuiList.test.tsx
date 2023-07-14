import "@testing-library/jest-dom"
import { render, screen, within } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { MuiList } from "./MuiList"
import {
  HatchifyPresentationDefaultValueComponents,
  getDefaultDisplayRender,
} from "@hatchifyjs/react-ui"

describe("hatchifyjs/presentation/mui/MuiList", () => {
  const useData = () =>
    [
      [
        {
          id: "uuid1",
          firstName: "Joe",
          lastName: "Smith",
        },
        { id: "uuid2", firstName: "John", lastName: "Snow" },
      ],
      {
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
      },
    ] as any // todo: fix typing

  const useNoData = () =>
    [
      [],
      {
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
      },
    ] as any

  const EmptyList = () => <div>so empty inside</div>

  const displays = [
    {
      key: "firstName",
      label: "First Name",
      render: getDefaultDisplayRender(
        "firstName",
        "string",
        HatchifyPresentationDefaultValueComponents,
      ),
    },
    {
      key: "lastName",
      label: "Last Name",
      render: getDefaultDisplayRender(
        "lastName",
        "string",
        HatchifyPresentationDefaultValueComponents,
      ),
    },
  ]

  describe("MuiList", () => {
    it("works", async () => {
      render(
        <MuiList
          useData={useData}
          displays={displays}
          sort={{
            direction: undefined,
            sortBy: undefined,
          }}
          setSort={() => vi.fn()}
          pagination={{ number: 1, size: 10 }}
          setPagination={() => vi.fn()}
          selected={{}}
          setSelected={() => vi.fn()}
          emptyList={EmptyList}
        />,
      )

      expect(await screen.findByText("First Name")).toBeInTheDocument()
      expect(await screen.findByText("Last Name")).toBeInTheDocument()
      expect(await screen.findByText("Joe")).toBeInTheDocument()
      expect(await screen.findByText("Smith")).toBeInTheDocument()
      expect(await screen.findByText("John")).toBeInTheDocument()
      expect(await screen.findByText("Snow")).toBeInTheDocument()
    })

    it("fires sort callback", async () => {
      const setSort = vi.fn()

      render(
        <MuiList
          useData={useData}
          displays={displays}
          sort={{
            direction: undefined,
            sortBy: undefined,
          }}
          setSort={setSort}
          pagination={{ number: 1, size: 10 }}
          setPagination={() => vi.fn()}
          selected={{}}
          setSelected={() => vi.fn()}
          emptyList={EmptyList}
        />,
      )

      await screen.findByText("First Name").then((el) => el.click())
      await screen.findByText("Last Name").then((el) => el.click())

      expect(setSort.mock.calls).toEqual([["firstName"], ["lastName"]])
    })

    it.skip("fires pagination callback", async () => {
      const setPagination = vi.fn()

      render(
        <MuiList
          useData={useData}
          displays={displays}
          sort={{
            direction: undefined,
            sortBy: undefined,
          }}
          setSort={() => vi.fn()}
          pagination={{ number: 1, size: 10 }}
          setPagination={setPagination}
          selected={{}}
          setSelected={() => vi.fn()}
          emptyList={EmptyList}
        />,
      )

      await screen.findByText("2").then((el) => el.click())
      await screen.findByText("3").then((el) => el.click())
      await screen.findByText("1").then((el) => el.click())

      expect(setPagination.mock.calls).toEqual([
        [{ number: 2, size: 10 }],
        [{ number: 3, size: 10 }],
        [{ number: 1, size: 10 }],
      ])
    })

    describe("fires checkbox callbacks", async () => {
      const setSelected = vi.fn()

      const renderWithSelected = (selected: Record<string, true> | true) =>
        render(
          <MuiList
            useData={useData}
            displays={displays}
            sort={{
              direction: undefined,
              sortBy: undefined,
            }}
            setSort={() => vi.fn()}
            pagination={{ number: 1, size: 10 }}
            setPagination={() => vi.fn()}
            selected={selected}
            setSelected={setSelected}
            emptyList={EmptyList}
          />,
        )

      it("selects all", async () => {
        renderWithSelected({})

        within(await screen.findByLabelText("select all"))
          .getByRole("checkbox")
          .click()

        expect(setSelected).toHaveBeenCalledWith(true)
      })

      it("deselects all", async () => {
        renderWithSelected(true)

        within(await screen.findByLabelText("select all"))
          .getByRole("checkbox")
          .click()

        expect(setSelected).toHaveBeenCalledWith({})
      })

      it("selects one", async () => {
        renderWithSelected({})

        within(await screen.findByLabelText("select uuid1"))
          .getByRole("checkbox")
          .click()

        expect(setSelected).toHaveBeenCalledWith({ uuid1: true })
      })

      it("selects an additional row", async () => {
        renderWithSelected({ uuid1: true })

        within(await screen.findByLabelText("select uuid2"))
          .getByRole("checkbox")
          .click()

        expect(setSelected).toHaveBeenCalledWith({ uuid1: true, uuid2: true })
      })

      it("deselects one", async () => {
        renderWithSelected({ uuid1: true, uuid2: true })

        within(await screen.findByLabelText("select uuid1"))
          .getByRole("checkbox")
          .click()

        expect(setSelected).toHaveBeenCalledWith({ uuid2: true })
      })
    })

    it("displays EmptyList component if there is no data", async () => {
      render(
        <MuiList
          useData={useNoData}
          displays={displays}
          sort={{
            direction: undefined,
            sortBy: undefined,
          }}
          setSort={() => vi.fn()}
          pagination={{ number: 1, size: 10 }}
          setPagination={() => vi.fn()}
          selected={{}}
          setSelected={() => vi.fn()}
          emptyList={EmptyList}
        />,
      )

      expect(await screen.findByText("so empty inside")).toBeInTheDocument()
    })
  })
})
