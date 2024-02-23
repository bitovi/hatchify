import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import {
  String,
  StringList,
  Number,
  NumberList,
  Boolean,
  BooleanList,
  Date,
  DateList,
  Relationship,
  RelationshipList,
} from "./DefaultDisplayComponents.js"

describe("components/HatchifyPresentationProvider/DefaultDisplayComponents/", () => {
  it("String works", async () => {
    render(<String value={"Hello"} />)

    expect(screen.getByText("Hello"))
  })

  it("StringList works", async () => {
    render(<StringList values={["Hello, Goodbye"]} />)

    expect(screen.getByText("Hello, Goodbye"))
  })

  it("Number works", async () => {
    render(<Number value={1000} />)

    expect(screen.getByText("1,000"))
  })

  it("NumberList works", async () => {
    render(<NumberList values={[1, 1000, 2]} />)

    expect(screen.getByText("1", { exact: false }))
    expect(screen.getByText("1,000", { exact: false }))
    expect(screen.getByText("2", { exact: false }))
  })

  it("Boolean works", async () => {
    render(<Boolean value={true} />)

    expect(screen.getByText("true"))
  })

  it("BooleanList works", async () => {
    render(<BooleanList values={[true, true, false]} />)

    expect(screen.getByText("true, true, false"))
  })

  describe("Date works", async () => {
    it("dateOnly", async () => {
      render(<Date dateOnly={true} value={"January 17, 2000"} />)
      expect(screen.getByText("1/17/2000"))
    })
    it("full date", async () => {
      render(<Date dateOnly={false} value={"January 17, 2000"} />)
      expect(screen.getByText("1/17/2000, 12:00:00 AM"))
    })

    it("value is invalid", async () => {
      render(<Date dateOnly={false} value={"Not a good date"} />)
      expect(screen.queryByText("AM")).not.toBeInTheDocument()
      expect(screen.queryByText("PM")).not.toBeInTheDocument()
    })
  })

  describe("DateList works", async () => {
    it("dateOnly", async () => {
      render(
        <DateList
          dateOnly={true}
          values={["January 1, 2000", "February 1, 2000", "March 1, 2000"]}
        />,
      )
      expect(screen.getByText("1/1/2000", { exact: false }))
      expect(screen.getByText("2/1/2000", { exact: false }))
      expect(screen.getByText("3/1/2000", { exact: false }))
    })

    it("full date", async () => {
      render(
        <DateList
          dateOnly={false}
          values={["January 1, 2000", "February 1, 2000", "March 1, 2000"]}
        />,
      )
      expect(screen.getByText("1/1/2000, 12:00:00 AM", { exact: false }))
      expect(screen.getByText("2/1/2000, 12:00:00 AM", { exact: false }))
      expect(screen.getByText("3/1/2000, 12:00:00 AM", { exact: false }))
    })
  })

  it("Relationship works", async () => {
    render(
      <Relationship value={{ id: "1", label: "label", something: true }} />,
    )
    expect(screen.getByText("label"))
  })

  it("RelationshipList works", async () => {
    render(
      <RelationshipList
        values={[
          { id: "1", label: "label", something: true },
          { id: "2", label: "otherLabel", somethingNumber: 1 },
        ]}
      />,
    )
    expect(screen.getByText("label, otherLabel"))
  })
})
