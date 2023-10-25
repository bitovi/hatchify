import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import StringInput from "./StringInput"

describe("components/MuiFilters/inputs/StringInput", () => {
  it("works", async () => {
    render(
      <StringInput labelId="" operator="$eq" value="" onChange={vi.fn()} />,
    )
  })

  it("renders MuiAutocompelte when operator is $in", async () => {
    render(
      <StringInput
        labelId=""
        onChange={vi.fn()}
        value="Pending"
        operator="$in"
      />,
    )

    const dropdownContainer = screen.getByTestId("autocomplete-input")
    const dropdown = dropdownContainer.querySelector("input") // eslint-disable-line testing-library/no-node-access
    expect(dropdown?.className.includes("MuiAutocomplete-input")).toEqual(true)
  })
})
