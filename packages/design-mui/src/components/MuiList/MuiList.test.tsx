import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
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
        meta: undefined,
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
        />,
      )

      await screen.findByText("First Name").then((el) => el.click())
      expect(setSort).toHaveBeenCalledWith("firstName")

      await screen.findByText("Last Name").then((el) => el.click())
      expect(setSort).toHaveBeenCalledWith("lastName")
    })
  })
})
