import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import OperatorSelect from "./OperatorSelect"

describe("components/MuiFilters/inputs/OperatorSelect", () => {
  it("works", async () => {
    const onChange = vi.fn()

    render(
      <OperatorSelect
        labelId=""
        options={[
          { operator: "$eq", text: "Equals" },
          { operator: "$ne", text: "Not Equals" },
          { operator: "empty", text: "Is Empty" },
        ]}
        value="$eq"
        onChange={(value) => onChange(value)}
      />,
    )

    const dropdown = screen.getByRole("button")
    expect(dropdown.className.includes("MuiSelect-select")).toEqual(true)
    expect(dropdown.className.includes("MuiAutocomplete-input")).toEqual(false)

    await userEvent.click(dropdown)
    const option = screen.getByText("Not Equals")

    await userEvent.click(option)
    expect(onChange).toHaveBeenCalledWith("$ne")
  })
})
