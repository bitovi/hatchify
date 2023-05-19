import { describe, it } from "vitest"
import { render } from "@testing-library/react"

import {HatchifyList} from "./HatchifyList"
import type { Schema } from "@hatchifyjs/data-core"

const TestSchema: Schema = {
  name: "Test",
  attributes: { id: "string", name: "string" },
  displayAttribute: "name",
}

describe("hatchifyjs/components/HatchifyList", () => {
  describe("HatchifyList", () => {
    it("works", () => {
      render(<HatchifyList schema={TestSchema} />)
    })
  })
})
