import { render, screen } from "@testing-library/react"

import { MuiList } from "./MuiList"
import {
  HatchifyPresentationDefaultValueComponents,
  getDefaultDisplayRender,
} from "@hatchifyjs/react"

describe.skip("hatchifyjs/presentation/mui/MuiList", () => {
  describe.skip("MuiList", () => {
    it("works", async () => {
      render(
        <MuiList
          useData={() => [
            {
              id: "uuid1",
              firstName: "Joe",
              lastName: "Smith",
            },
            { id: "uuid2", firstName: "John", lastName: "Snow" },
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
