import "@testing-library/jest-dom"
import { describe, it, vi, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  HatchifyExtraDisplay,
  HatchifyAttributeDisplay,
  HatchifyAttributeField,
  HatchifyEmptyList,
} from "./HatchifyDisplays"

describe("hatchifyjs/components/HatchifyColumns", () => {
  describe("HatchifyExtraDisplay", () => {
    it("works", () => {
      render(<HatchifyExtraDisplay label="Label" render={() => <div />} />)
    })
  })

  describe("HatchifyAttributeDisplay", () => {
    it("works", () => {
      render(<HatchifyAttributeDisplay attribute="field" />)
    })
  })

  describe("HatchifyAttributeField", () => {
    it("works", async () => {
      render(<HatchifyAttributeField attribute="field" render={vi.fn()} />)
    })
  })

  describe("HatchifyEmptyList", () => {
    it("works", async () => {
      render(<HatchifyEmptyList>So empty inside</HatchifyEmptyList>)
      expect(await screen.findByText("So empty inside")).toBeInTheDocument()
    })
  })
})
