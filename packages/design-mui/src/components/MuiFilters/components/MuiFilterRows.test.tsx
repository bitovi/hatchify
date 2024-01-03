import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import MuiFilterRows, {
  getAvailableOperator,
  getAttributeControl,
} from "./MuiFilterRows"
import type { PartialSchema } from "@hatchifyjs/core"
import {
  assembler,
  belongsTo,
  boolean,
  datetime,
  enumerate,
  hasMany,
} from "@hatchifyjs/core"
import { string } from "@hatchifyjs/core"

const partialSchemas = {
  Todo: {
    name: "Todo",
    displayAttribute: "name",
    attributes: {
      name: string({ required: true }),
      date: datetime(),
      important: boolean(),
      status: enumerate({ values: ["Pending", "Failed", "Complete"] }),
    },
    relationships: {
      user: belongsTo(),
    },
  },
  User: {
    name: "User",
    displayAttribute: "name",
    attributes: {
      name: string(),
    },
    relationships: {
      todo: hasMany(),
    },
  },
} satisfies Record<string, PartialSchema>

const finalSchemas = assembler(partialSchemas)

describe("components/MuiFilterRows", () => {
  it("works", async () => {
    const setFilters = vi.fn()
    const removeFilter = vi.fn()

    render(
      <MuiFilterRows
        finalSchemas={finalSchemas}
        schemaName="Todo"
        fields={["name", "date"]}
        filters={[
          { field: "name", operator: "icontains", value: "test" },
          { field: "date", operator: "$gt", value: "2020-01-01 01:01" },
        ]}
        setFilters={setFilters}
        removeFilter={removeFilter}
      />,
    )

    const secondRowClose = screen.getAllByLabelText("close")[1]
    const firstRowClose = screen.getAllByLabelText("close")[0]

    // todo: test select change
    // todo: test input change

    // click first row close
    await userEvent.click(firstRowClose)
    expect(removeFilter).toHaveBeenCalledWith(0)

    // click second row close
    await userEvent.click(secondRowClose)
    expect(removeFilter).toHaveBeenCalledWith(1)
  })

  it("sets the filter correctly when column is changed", async () => {
    const setFilters = vi.fn()

    render(
      <MuiFilterRows
        finalSchemas={finalSchemas}
        schemaName="Todo"
        fields={["name", "date"]}
        filters={[{ field: "name", operator: "icontains", value: "test" }]}
        setFilters={setFilters}
        removeFilter={vi.fn()}
      />,
    )

    const dropdownContainer = screen.getByTestId("column-select")
    const dropdown = dropdownContainer.querySelector("div") // eslint-disable-line testing-library/no-node-access
    await userEvent.click(dropdown as any)

    const dateSelection = screen.getByText("Date")
    await userEvent.click(dateSelection)

    expect(setFilters).toHaveBeenCalledWith([
      {
        field: "date",
        operator: "$eq",
        value: "",
      },
    ])
  })

  it("sets the filter correctly when operator is changed", async () => {
    const setFilters = vi.fn()

    render(
      <MuiFilterRows
        finalSchemas={finalSchemas}
        schemaName="Todo"
        fields={["name", "date"]}
        filters={[{ field: "name", operator: "icontains", value: "test" }]}
        setFilters={setFilters}
        removeFilter={vi.fn()}
      />,
    )

    const dropdownContainer = screen.getByTestId("operator-select")
    const dropdown = dropdownContainer.querySelector("div") // eslint-disable-line testing-library/no-node-access
    await userEvent.click(dropdown as any)

    const eqSelection = screen.getByText("equals")
    await userEvent.click(eqSelection)

    expect(setFilters).toHaveBeenCalledWith([
      {
        field: "name",
        operator: "$eq",
        value: "test",
      },
    ])
  })

  it("resets the value when switching from array operator type to another operator type", async () => {
    const setFilters = vi.fn()

    render(
      <MuiFilterRows
        finalSchemas={finalSchemas}
        schemaName="Todo"
        fields={["name", "date", "status"]}
        filters={[{ field: "status", operator: "$in", value: ["Pending"] }]}
        setFilters={setFilters}
        removeFilter={vi.fn()}
      />,
    )

    const dropdownContainer = screen.getByTestId("operator-select")
    const dropdown = dropdownContainer.querySelector("div") // eslint-disable-line testing-library/no-node-access
    await userEvent.click(dropdown as HTMLDivElement)

    const eqSelection = screen.getByText("is not")
    await userEvent.click(eqSelection)

    expect(setFilters).toHaveBeenCalledWith([
      {
        field: "status",
        operator: "$ne",
        value: "",
      },
    ])
  })

  it("resets the value when switching to array operator type from another operator type", async () => {
    const setFilters = vi.fn()

    render(
      <MuiFilterRows
        finalSchemas={finalSchemas}
        schemaName="Todo"
        fields={["name", "date", "status"]}
        filters={[{ field: "status", operator: "$ne", value: "Pending" }]}
        setFilters={setFilters}
        removeFilter={vi.fn()}
      />,
    )

    const dropdownContainer = screen.getByTestId("operator-select")
    const dropdown = dropdownContainer.querySelector("div") // eslint-disable-line testing-library/no-node-access
    await userEvent.click(dropdown as HTMLDivElement)

    const eqSelection = screen.getByText("is not any of")
    await userEvent.click(eqSelection)

    expect(setFilters).toHaveBeenCalledWith([
      {
        field: "status",
        operator: "$nin",
        value: [],
      },
    ])
  })

  it("leaves array value when switching between array type operators", async () => {
    const setFilters = vi.fn()

    render(
      <MuiFilterRows
        finalSchemas={finalSchemas}
        schemaName="Todo"
        fields={["name", "date", "status"]}
        filters={[{ field: "status", operator: "$nin", value: ["Pending"] }]}
        setFilters={setFilters}
        removeFilter={vi.fn()}
      />,
    )

    const dropdownContainer = screen.getByTestId("operator-select")
    const dropdown = dropdownContainer.querySelector("div") // eslint-disable-line testing-library/no-node-access
    await userEvent.click(dropdown as HTMLDivElement)

    const eqSelection = screen.getByText("is any of")
    await userEvent.click(eqSelection)

    expect(setFilters).toHaveBeenCalledWith([
      {
        field: "status",
        operator: "$in",
        value: ["Pending"],
      },
    ])
  })

  describe("getAttributeControl", () => {
    it("works", () => {
      const result = getAttributeControl(finalSchemas, "name", "Todo")

      expect(result.type).toEqual("String")
      expect(result.allowNull).toEqual(false)
    })

    it("Gets the correct field from a relationship field", () => {
      const result = getAttributeControl(finalSchemas, "user.name", "Todo")

      expect(result.type).toEqual("String")
      expect(result.allowNull).toEqual(true)
    })
  })

  describe("getAvailableOperator", () => {
    it("works", () => {
      expect(
        getAvailableOperator(
          "$eq",
          finalSchemas["User"].attributes.name.control,
        ),
      ).toEqual("$eq")
    })

    it("Gets the first available operator if the current one is incompatible", () => {
      expect(
        getAvailableOperator(
          "$gt",
          finalSchemas["User"].attributes.name.control,
        ),
      ).toEqual("icontains")
    })

    it("Does not include empty/nempty if the field is required", async () => {
      const setFilters = vi.fn()

      render(
        <MuiFilterRows
          finalSchemas={finalSchemas}
          schemaName="Todo"
          fields={["name", "date", "status"]}
          filters={[
            { field: "name", operator: "icontains", value: "Walk the dog" },
          ]}
          setFilters={setFilters}
          removeFilter={vi.fn()}
        />,
      )

      const dropdowns = screen.getAllByRole("button")
      await userEvent.click(dropdowns[2])

      const emptySelection = screen.queryByText("is empty")
      expect(emptySelection).toBeNull()
    })

    it("Sets the type correctly if attribute is not an object", async () => {
      const setFilters = vi.fn()

      render(
        <MuiFilterRows
          finalSchemas={finalSchemas}
          schemaName="User"
          fields={["name"]}
          filters={[{ field: "name", operator: "icontains", value: "Mary" }]}
          setFilters={setFilters}
          removeFilter={vi.fn()}
        />,
      )

      const dropdownContainer = screen.getByTestId("operator-select")
      const dropdown = dropdownContainer.querySelector("div") // eslint-disable-line testing-library/no-node-access
      await userEvent.click(dropdown as any)

      const emptySelection = screen.queryByText("starts with")
      expect(emptySelection).toBeTruthy()
    })
  })
})
