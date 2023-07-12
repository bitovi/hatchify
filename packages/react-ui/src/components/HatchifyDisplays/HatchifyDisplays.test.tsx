import { describe, it, vi } from "vitest"

import { render } from "@testing-library/react"
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
    it("works", () => {
      render(<HatchifyAttributeField attribute="field" render={vi.fn()} />)
    })
  })

  describe("HatchifyEmptyList", () => {
    it("works", () => {
      render(<HatchifyEmptyList label="Empty List" render={() => <div />} />)
    })
  })
})
