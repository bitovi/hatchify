import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ColumnSelect from "./ColumnSelect"

describe("components/MuiFilters/inputs/ColumnSelect", () => {
  it("works", async () => {
    const onChange = vi.fn()

    render(
      <ColumnSelect
        labelId=""
        fields={["name", "status", "due_date"]}
        value="name"
        onChange={(value) => onChange(value)}
      />,
    )

    const dropdown = screen.getByRole("button")
    expect(dropdown.className.includes("MuiSelect-select")).toEqual(true)
    expect(dropdown.className.includes("MuiAutocomplete-input")).toEqual(false)

    await userEvent.click(dropdown)
    const option = screen.getByText("status")

    await userEvent.click(option)
    expect(onChange).toHaveBeenCalledWith("status")
  })
})
