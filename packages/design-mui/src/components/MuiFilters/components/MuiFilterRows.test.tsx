import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import MuiFilterRows from "./MuiFilterRows"
import { integer } from "@hatchifyjs/hatchify-core"

// todo: v2 schema only supports numbers, filter does not support numbers
describe.skip("components/MuiFilters/components/MuiFilterRows", () => {
  const partialSchemas = {
    Todo: {
      name: "Todo",
      attributes: {
        views: integer(),
        importance: integer(),
      },
    },
  }

  it("works", async () => {
    const setFilters = vi.fn()
    const removeFilter = vi.fn()

    render(
      <MuiFilterRows
        attributes={partialSchemas.Todo.attributes}
        fields={["name", "date"]}
        filters={[
          { field: "views", operator: "$ilike", value: "test" },
          {
            field: "importance",
            operator: "nempty",
            value: "2020-01-01 01:01",
          },
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
