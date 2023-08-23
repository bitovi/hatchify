import { describe, it, vi } from "vitest"
import { render } from "@testing-library/react"
import DateInput from "./DateInput"

describe("components/MuiFilters/inputs/DateInput", () => {
  it("works", async () => {
    render(<DateInput labelId="" value="" onChange={vi.fn()} />)
  })
})
