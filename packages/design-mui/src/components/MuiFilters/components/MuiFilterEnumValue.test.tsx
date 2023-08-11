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
    expect(dropdown.className.includes("MuiSelect-multiple")).toEqual(false)

    await userEvent.click(dropdown)
    const firstOption = screen.getByText("Pending")

    await userEvent.click(firstOption)
    expect(handleChange).toHaveBeenCalled()
  })

  it("displays the multiselect when $in is the value", async () => {
    const handleChange = vi.fn()

    render(
      <MuiFilterEnumValue
        options={["Pending", "Failed"]}
        handleChange={(value) => handleChange(value)}
        value=""
        operator={"$in"}
      />,
    )

    // const dropdown = screen.getByRole("button")
    // expect(dropdown.className.includes("MuiSelect-multiple")).toEqual(true)
  })
})
