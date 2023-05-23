import { describe, it, expect } from "vitest"

import { render, screen } from "@testing-library/react"
import { Relationship, RelationshipList } from "."

describe("hatchifyjs/presentation/mui/MuiProvider/DefaultComponents", () => {
  describe("Relationship", () => {
    it("works", async () => {
      render(<Relationship value={{ id: "1", label: "label-1" }} />)
      expect(await screen.findByText("label-1")).toBeDefined()
    })
  })

  describe("RelationshipList", () => {
    it("works", async () => {
      render(
        <RelationshipList
          values={[
            { id: "1", label: "label-1" },
            { id: "2", label: "label-2" },
          ]}
        />,
      )
      expect(await screen.findByText("label-1")).toBeDefined()
      expect(await screen.findByText("label-2")).toBeDefined()
    })
  })
})
