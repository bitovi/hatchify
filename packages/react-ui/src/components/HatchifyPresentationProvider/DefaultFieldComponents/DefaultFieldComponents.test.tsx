import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import {
  String,
  Number,
  Boolean,
  Date,
  Relationship,
} from "./DefaultFieldComponents.js"

describe("components/HatchifyPresentationProvider/DefaultFieldComponents/", () => {
  it("String renders", async () => {
    render(<String value={"Test"} label={"Test Label"} onUpdate={vi.fn()} />)
    expect(screen.getByRole("textbox")).toHaveValue("Test")
    expect(screen.getByText("Test Label", { exact: false }))
  })

  it("Number renders", async () => {
    render(<Number value={100} label={"Test Label"} onUpdate={vi.fn()} />)
    expect(screen.getByRole("spinbutton")).toHaveValue(100)
    expect(screen.getByText("Test Label", { exact: false }))
  })

  it("Boolean renders", async () => {
    render(<Boolean value={true} label={"Test Label"} onUpdate={vi.fn()} />)
    expect(screen.getByRole("checkbox")).toBeChecked()
    expect(screen.getByText("Test Label", { exact: false }))
  })

  it("Date renders", async () => {
    render(<Date value={"date"} label={"Test Label"} onUpdate={vi.fn()} />)
    expect(screen.getByText("Test Label", { exact: false }))
  })

  it("Relationship renders", async () => {
    render(
      <Relationship
        values={["first"]}
        label={"Test Label"}
        options={[
          { id: "1", label: "first" },
          { id: "2", label: "second" },
        ]}
        hasMany={false}
        onUpdate={vi.fn()}
      />,
    )

    expect(screen.getByText("Test Label", { exact: false }))
    expect(screen.getByLabelText("first"))
    expect(screen.getByLabelText("second"))
  })
})
