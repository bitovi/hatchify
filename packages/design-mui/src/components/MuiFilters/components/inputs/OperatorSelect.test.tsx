import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import OperatorSelect from "./OperatorSelect.js"

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

    // const drop = screen.getByDisplayValue("Equals")
    // console.log(
    //   "DROP 🟢🔥🟢🔥🟢🔥🟢🔥🟢🔥🟢🔥🟢🔥🟢🔥🟢🔥🟢🔥🟢🔥🟢🔥🟢🔥🟢🔥🟢🔥🟢🔥",
    //   drop,
    // )
    const dropdownContainer = screen.getByTestId("operator-select")
    const dropdown = dropdownContainer.querySelector("div") // eslint-disable-line testing-library/no-node-access
    expect(dropdown?.className.includes("MuiSelect-select")).toEqual(true)
    expect(dropdown?.className.includes("MuiAutocomplete-input")).toEqual(false)

    await userEvent.click(dropdown as any)
    const option = screen.getByText("Not Equals")

    await userEvent.click(option)
    expect(onChange).toHaveBeenCalledWith("$ne")
  })
})
