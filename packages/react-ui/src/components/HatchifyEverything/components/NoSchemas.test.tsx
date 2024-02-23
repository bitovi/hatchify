import "@testing-library/jest-dom"
import { render } from "@testing-library/react"
import { describe, it } from "vitest"
import { NoSchemas } from "./NoSchemas.js"

describe("components/HatchifyEverything/components/NoSchemas", () => {
  it("Works", async () => {
    render(<NoSchemas />)
  })
})
