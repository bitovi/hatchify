import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MuiMultiSelect } from "./MuiMultiSelect"

describe("components/MuiFilters/components/MuiMultiSelect", () => {
  it("works", async () => {
    const handleChange = vi.fn()

    render(
      <MuiMultiSelect
        options={["Pending", "Failed"]}
        handleChange={(value) => handleChange(value)}
      />,
    )

    const dropdown = screen.getByRole("button")

    await userEvent.click(dropdown)
    const firstOption = screen.getByText("Pending")

    //updates values when items are selected in the multiselect.
    await userEvent.click(firstOption)
    expect(handleChange).toHaveBeenCalledWith(["Pending"])

    const secondOption = screen.getByText("Failed")
    await userEvent.click(secondOption)
    expect(handleChange).toHaveBeenCalledWith(["Pending", "Failed"])

    //removes selections and updates values when items are closed out of the selected items
    await userEvent.click(dropdown)
    const closeChips = screen.getAllByTestId("CloseIcon")

    await userEvent.click(closeChips[0])
    expect(handleChange).toHaveBeenCalledWith(["Failed"])

    await userEvent.click(closeChips[1])
    expect(handleChange).toHaveBeenCalledWith([])
  })
})
