import { describe, it, vi } from "vitest"
import { render } from "@testing-library/react"

import { HatchifyDetails } from "./HatchifyDetails"
// import type { Schema } from "@hatchifyjs/data-core"
import type { Schema } from "../../services/api/schemas" //TODO update schema

const TestSchema: Schema = {
  name: "Test",
  attributes: { id: "string", name: "string" },
  displayField: "name",
  jsonApiField: "tests",
}

//Mock wont be used until we find a way to read the param.
//TODO mock the api when we get enough data about the api
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<object>("react-router-dom")

  return {
    ...actual,
    useParams: vi.fn().mockReturnValue({
      id: "1",
    }),
  }
})

describe("hatchifyjs/components/HatchifyDetails", () => {
  describe("HatchifyDetails", () => {
    it("works", () => {
      render(<HatchifyDetails schema={TestSchema} />)
    })
  })
})
