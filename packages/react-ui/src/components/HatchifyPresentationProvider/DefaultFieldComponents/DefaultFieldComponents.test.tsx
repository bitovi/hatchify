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
  it("String works", async () => {
    render(<String value={"Test"} label={"Test Label"} onUpdate={vi.fn()} />)
    expect(screen.getByRole("textbox")).toHaveValue("Test")
    expect(screen.getByText("Test Label", { exact: false }))
  })

  it("Number works", async () => {
    render(<Number value={100} label={"Test Label"} onUpdate={vi.fn()} />)
    expect(screen.getByRole("spinbutton")).toHaveValue(100)
    expect(screen.getByText("Test Label", { exact: false }))
  })

  it("Boolean works", async () => {
    render(<Boolean value={true} label={"Test Label"} onUpdate={vi.fn()} />)
    expect(screen.getByRole("checkbox")).toBeChecked()
    expect(screen.getByText("Test Label", { exact: false }))
  })

  it("Date works", async () => {
    render(<Date value={"date"} label={"Test Label"} onUpdate={vi.fn()} />)
    expect(screen.getByText("Test Label", { exact: false }))
  })

  it("Relationship works", async () => {
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

  //   it("Number works", async () => {
  //     render(<Number value={1000} />)

  //     expect(screen.getByText("1,000"))
  //   })

  //   it("Boolean works", async () => {
  //     render(<Boolean value={true} />)

  //     expect(screen.getByText("true"))
  //   })

  //   describe("Date works", async () => {
  //     it("dateOnly", async () => {
  //       render(<Date dateOnly={true} value={"January 17, 2000"} />)
  //       expect(screen.getByText("1/17/2000"))
  //     })
  //     it("full date", async () => {
  //       render(<Date dateOnly={false} value={"January 17, 2000"} />)
  //       expect(screen.getByText("1/17/2000, 12:00:00 AM"))
  //     })

  //     it("value is invalid", async () => {
  //       render(<Date dateOnly={false} value={"Not a good date"} />)
  //       expect(screen.queryByText("AM")).not.toBeInTheDocument()
  //       expect(screen.queryByText("PM")).not.toBeInTheDocument()
  //     })
  //   })

  //   it("Relationship works", async () => {
  //     render(
  //       <Relationship value={{ id: "1", label: "label", something: true }} />,
  //     )
  //     expect(screen.getByText("label"))
  //   })
})
