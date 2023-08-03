import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import MuiFilterRows from "./MuiFilterRows"

describe("components/MuiFilters/components/MuiFilterRows", () => {
  it("works", async () => {
    const setFilters = vi.fn()
    const removeFilter = vi.fn()

    render(
      <MuiFilterRows
        attributes={{
          name: "string",
          date: "date",
        }}
        fields={["name", "date"]}
        filters={[
          { field: "name", operator: "ilike", value: "test" },
          { field: "date", operator: "nempty", value: "2020-01-01 01:01" },
        ]}
        setFilters={setFilters}
        removeFilter={removeFilter}
      />,
    )

    const secondRowClose = screen.getAllByLabelText("close")[1]
    const firstRowClose = screen.getAllByLabelText("close")[0]

    // todo: test select change
    // todo: test input change

    // click first row close
    await userEvent.click(firstRowClose)
    expect(removeFilter).toHaveBeenCalledWith(0)

    // click second row close
    await userEvent.click(secondRowClose)
    expect(removeFilter).toHaveBeenCalledWith(1)
  })
})
