import "@testing-library/jest-dom"
import { render } from "@testing-library/react"
import { describe, it } from "vitest"
import { HatchifyEmpty } from "./HatchifyEmpty.js"

describe("components/HatchifyEverything/components/HatchifyEmpty", () => {
  it("'HatchifyEmpty' renders", async () => {
    render(<HatchifyEmpty> </HatchifyEmpty>)
  })
})
