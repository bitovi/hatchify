import { describe, it } from "vitest"
import { render } from "@testing-library/react"

import { HatchifyList } from "./HatchifyList"
// import type { Schema } from "@hatchifyjs/rest-client"
import type { Schema } from "../../services-legacy/api/schemas" //TODO update schema

const TestSchema: Schema = {
  name: "Test",
  attributes: { id: "string", name: "string" },
  displayField: "name",
  jsonApiField: "tests",
}

describe("hatchifyjs/components/HatchifyList", () => {
  describe("HatchifyList", () => {
    it("works", () => {
      render(<HatchifyList schema={TestSchema} />)
    })
  })
})
