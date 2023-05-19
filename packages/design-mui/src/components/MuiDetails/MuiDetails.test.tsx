import { describe, it, expect } from "vitest"

import { render, screen } from "@testing-library/react"

import {MuiDetails} from "./MuiDetails"
import { HatchifyPresentationDefaultValueComponents, getDefaultDisplayRender } from "@hatchifyjs/react"

describe("hatchifyjs/presentation/mui/MuiDetails", () => {
  describe("MuiDetails", () => {
    it("works", async () => {
      render(
        <MuiDetails
          useData={() => ({
            id: "uuid",
            firstName: "Joe",
            lastName: "Smith",
          })}
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
      expect(await screen.findByText("Joe")).toBeInTheDocument()
      expect(await screen.findByText("Last Name")).toBeInTheDocument()
      expect(await screen.findByText("Smith")).toBeInTheDocument()
    })
  })
})
