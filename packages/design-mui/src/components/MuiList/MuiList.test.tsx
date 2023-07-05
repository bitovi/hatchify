import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, it, expect } from "vitest"
import { MuiList } from "./MuiList"
import {
  HatchifyPresentationDefaultValueComponents,
  getDefaultDisplayRender,
} from "@hatchifyjs/react-ui"

describe("hatchifyjs/presentation/mui/MuiList", () => {
  describe("MuiList", () => {
    it("works", async () => {
      render(
        <MuiList
          useData={() => [
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
          ]}
          displays={[
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
          ]}
          sort={{
            direction: undefined,
            sortBy: false,
          }}
          changeSort={() => jest.fn()}
          formatQueryString={() => ""}
        />,
      )

      expect(await screen.findByText("First Name")).toBeInTheDocument()
      expect(await screen.findByText("Last Name")).toBeInTheDocument()
      expect(await screen.findByText("Joe")).toBeInTheDocument()
      expect(await screen.findByText("Smith")).toBeInTheDocument()
      expect(await screen.findByText("John")).toBeInTheDocument()
      expect(await screen.findByText("Snow")).toBeInTheDocument()
    })
  })
})
