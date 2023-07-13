import "@testing-library/jest-dom"
import { getByRole, render, screen } from "@testing-library/react"
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
          checked={[]}
          setChecked={() => vi.fn()}
          toggleChecked={() => vi.fn()}
          clearChecked={() => vi.fn()}
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
          checked={[]}
          setChecked={() => vi.fn()}
          toggleChecked={() => vi.fn()}
          clearChecked={() => vi.fn()}
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
          checked={[]}
          setChecked={() => vi.fn()}
          toggleChecked={() => vi.fn()}
          clearChecked={() => vi.fn()}
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

    it("fires checkbox callbacks", async () => {
      const setChecked = vi.fn()
      const toggleChecked = vi.fn()
      const clearChecked = vi.fn()
      const checked: string[] = []

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
          checked={checked}
          setChecked={setChecked}
          toggleChecked={toggleChecked}
          clearChecked={clearChecked}
        />,
      )

      const headerCheckContainer = await screen.findByLabelText("check all")
      const headerCheck = getByRole(headerCheckContainer, "checkbox")
      const firstCheckContainer = await screen.findByLabelText("check uuid1")
      const firstCheck = getByRole(firstCheckContainer, "checkbox")
      const secondCheckContainer = await screen.findByLabelText("check uuid2")
      const secondCheck = getByRole(secondCheckContainer, "checkbox")

      firstCheck.click()
      firstCheck.click()
      secondCheck.click()
            headerCheck.click()
      headerCheck.click()

      expect(toggleChecked.mock.calls).toEqual([
        ["uuid1"],
        ["uuid1"],
        ["uuid2"],
      ])
      expect(setChecked.mock.calls).toEqual([["uuid1", "uuid2"]])
      expect(clearChecked.mock.calls).toEqual([])
  })
})
