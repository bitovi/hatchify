import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import EnumInput from "./EnumInput"

describe("components/MuiFilters/inputs/EnumInput", () => {
  it("works", async () => {
    const handleChange = vi.fn()

    render(
      <EnumInput
        labelId=""
        options={["Pending", "Failed"]}
        onChange={(value) => handleChange(value)}
        value=""
        operator={"$eq"}
      />,
    )

    const dropdown = screen.getByRole("combobox")
    expect(dropdown.className.includes("MuiSelect-select")).toEqual(true)
    expect(dropdown.className.includes("MuiAutocomplete-input")).toEqual(false)

    await userEvent.click(dropdown)
    const firstOption = screen.getByText("Pending")

    await userEvent.click(firstOption)
    expect(handleChange).toHaveBeenCalled()
  })

  it("renders MuiAutocompelte when operator is $in", async () => {
    render(
      <EnumInput
        labelId=""
        options={["Pending", "Failed"]}
        onChange={vi.fn()}
        value=""
        operator={"$in"}
      />,
    )

    const dropdown = screen.getByRole("combobox")
    expect(dropdown.className.includes("MuiAutocomplete-input")).toEqual(true)
  })
})
