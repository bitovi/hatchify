import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MuiAutocomplete } from "./MuiAutocomplete"
import { useState } from "react"

describe("components/MuiFilters/components/MuiAutocomplete", () => {
  it("works", async () => {
    const handleChange = vi.fn()

    render(<TestWrapper handleChange={handleChange} />)

    const dropdown = screen.getByRole("combobox")

    await userEvent.click(dropdown)
    const firstOption = screen.getByText("Pending")

    //updates values when items are selected in the multiselect.
    await userEvent.click(firstOption)
    expect(handleChange).toHaveBeenCalledWith(["Pending"])

    await userEvent.click(dropdown)
    const secondOption = screen.getByText("Failed")
    await userEvent.click(secondOption)

    expect(handleChange).toHaveBeenCalledWith(["Pending", "Failed"])

    const closeChips = screen.getAllByTestId("CancelIcon")

    await userEvent.click(closeChips[0])
    expect(handleChange).toHaveBeenCalledWith(["Failed"])

    //The Close icon closes out all selected chips
    await userEvent.click(dropdown)
    const reselectedPending = screen.getByText("Pending")

    await userEvent.click(reselectedPending)
    expect(handleChange).toHaveBeenCalledWith(["Failed", "Pending"])

    const closeAllChips = screen.getByTestId("CloseIcon")
    await userEvent.click(closeAllChips)
    expect(handleChange).toHaveBeenCalledWith([])
  })
})

const TestWrapper: React.FC<{
  handleChange: (val: string[]) => void
}> = ({ handleChange }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  return (
    <MuiAutocomplete
      options={["Pending", "Failed"]}
      handleChange={(value) => {
        handleChange(value)
        setSelectedOptions(value)
      }}
      selectedOptions={selectedOptions}
    />
  )
}
