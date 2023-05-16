import { describe, it } from "vitest"

import { render } from "@testing-library/react"
import {HatchifyListPage} from "./HatchifyListPage"
import type { Schema } from "data-core"

const TestSchema: Schema = {
  name: "Test",
  attributes: { id: "string", name: "string" },
  displayAttribute: "name",
}

describe("hatchifyjs/components/HatchifyListPage", () => {
  describe("HatchifyListPage", () => {
    it("works", () => {
      render(<HatchifyListPage schema={TestSchema} />)
    })
  })
})
