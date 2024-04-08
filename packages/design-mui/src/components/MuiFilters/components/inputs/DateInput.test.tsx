import { describe, it, vi } from "vitest"
import { render } from "@testing-library/react"
import DateInput from "./DateInput.js"

describe("components/MuiFilters/inputs/DateInput", () => {
  it("works", async () => {
    render(
      <DateInput controlType="Date" labelId="" value="" onChange={vi.fn()} />,
    )
  })
})
