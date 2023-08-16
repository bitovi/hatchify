import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MuiFilterEnumValue } from "./MuiFilterEnumValue"

describe("components/MuiFilters/components/MuiFilterEnumValue", () => {
  it("works", async () => {
    const handleChange = vi.fn()

    render(
      <MuiFilterEnumValue
        options={["Pending", "Failed"]}
        handleChange={(value) => handleChange(value)}
        value=""
        operator={"$eq"}
      />,
    )

    const dropdown = screen.getByRole("button")
    expect(dropdown.className.includes("MuiSelect-select")).toEqual(true)
    expect(dropdown.className.includes("MuiAutocomplete-input")).toEqual(false)

    await userEvent.click(dropdown)
    const firstOption = screen.getByText("Pending")

    await userEvent.click(firstOption)
    expect(handleChange).toHaveBeenCalled()
  })

  it("displays the autocomplete when $in is the value", async () => {
    render(
      <MuiFilterEnumValue
        options={["Pending", "Failed"]}
        handleChange={vi.fn()}
        value=""
        operator={"$in"}
      />,
    )

    const dropdown = screen.getByRole("combobox")
    expect(dropdown.className.includes("MuiAutocomplete-input")).toEqual(true)
  })
})
