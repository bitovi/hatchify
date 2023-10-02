import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import MuiFilterRows, {
  getAvailableOperator,
  getFieldAndAttributes,
} from "./MuiFilterRows"
import type { Schemas } from "@hatchifyjs/rest-client"

const schemas: Schemas = {
  Todo: {
    name: "Todo",
    displayAttribute: "name",
    attributes: {
      name: { type: "string", allowNull: false },
      date: { type: "date" },
      important: { type: "boolean" },
      status: { type: "enum", values: ["Pending", "Failed", "Complete"] },
    },
    relationships: {
      user: {
        schema: "User",
        type: "one",
      },
    },
  },
  User: {
    name: "User",
    displayAttribute: "name",
    attributes: {
      name: "string",
    },
    relationships: {
      todo: {
        schema: "Todo",
        type: "many",
      },
    },
  },
}

describe("components/MuiFilters/components/MuiFilterRows", () => {
  it("works", async () => {
    const setFilters = vi.fn()
    const removeFilter = vi.fn()
    render(
      <MuiFilterRows
        allSchemas={schemas}
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
        allSchemas={schemas}
        schemaName="Todo"
        fields={["name", "date"]}
        filters={[{ field: "name", operator: "icontains", value: "test" }]}
        setFilters={setFilters}
        removeFilter={vi.fn()}
      />,
    )
    const dropdowns = screen.getAllByRole("button")
    await userEvent.click(dropdowns[1])
    const dateSelection = screen.getByText("date")
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
        allSchemas={schemas}
        schemaName="Todo"
        fields={["name", "date"]}
        filters={[{ field: "name", operator: "icontains", value: "test" }]}
        setFilters={setFilters}
        removeFilter={vi.fn()}
      />,
    )
    const dropdowns = screen.getAllByRole("button")
    await userEvent.click(dropdowns[2])
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
        allSchemas={schemas}
        schemaName="Todo"
        fields={["name", "date", "status"]}
        filters={[{ field: "status", operator: "$nin", value: ["Pending"] }]}
        setFilters={setFilters}
        removeFilter={vi.fn()}
      />,
    )
    const dropdowns = screen.getAllByRole("button")
    await userEvent.click(dropdowns[2])
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
        allSchemas={schemas}
        schemaName="Todo"
        fields={["name", "date", "status"]}
        filters={[{ field: "status", operator: "$ne", value: "Pending" }]}
        setFilters={setFilters}
        removeFilter={vi.fn()}
      />,
    )
    const dropdowns = screen.getAllByRole("button")
    await userEvent.click(dropdowns[2])
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
        allSchemas={schemas}
        schemaName="Todo"
        fields={["name", "date", "status"]}
        filters={[{ field: "status", operator: "$nin", value: ["Pending"] }]}
        setFilters={setFilters}
        removeFilter={vi.fn()}
      />,
    )
    const dropdowns = screen.getAllByRole("button")
    await userEvent.click(dropdowns[2])
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

  describe("getFieldAndAttributes", () => {
    it("works", () => {
      expect(getFieldAndAttributes(schemas, "name", "Todo")).toEqual({
        baseAttributes: {
          name: { type: "string", allowNull: false },
          date: { type: "date" },
          important: { type: "boolean" },
          status: {
            type: "enum",
            values: ["Pending", "Failed", "Complete"],
          },
        },
        baseField: "name",
      })
    })
    it("Gets the correct field from a relationship field", () => {
      expect(getFieldAndAttributes(schemas, "user.name", "Todo")).toEqual({
        baseAttributes: {
          name: "string",
        },
        baseField: "name",
      })
    })
  })
  describe("getAvailableOperator", () => {
    it("works", () => {
      expect(
        getAvailableOperator("name", "$eq", schemas["User"].attributes),
      ).toEqual("$eq")
    })
    it("Gets the first available operator if the current one is incompatible", () => {
      expect(
        getAvailableOperator("name", "$gt", schemas["User"].attributes),
      ).toEqual("icontains")
    })

    it("Does not include empty/nempty if the field is required", async () => {
      const setFilters = vi.fn()
      render(
        <MuiFilterRows
          allSchemas={schemas}
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
          allSchemas={schemas}
          schemaName="User"
          fields={["name"]}
          filters={[{ field: "name", operator: "icontains", value: "Mary" }]}
          setFilters={setFilters}
          removeFilter={vi.fn()}
        />,
      )
      const dropdowns = screen.getAllByRole("button")
      await userEvent.click(dropdowns[2])
      const emptySelection = screen.queryByText("starts with")

      expect(emptySelection).toBeTruthy()
    })
  })
})
