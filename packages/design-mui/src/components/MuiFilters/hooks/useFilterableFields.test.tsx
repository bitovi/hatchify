import type { Schemas } from "@hatchifyjs/rest-client"
import "@testing-library/jest-dom"
import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import useFilterableFields from "./useFilterableFields"

const schemas: Schemas = {
  Todo: {
    name: "Todo",
    displayAttribute: "name",
    attributes: {
      name: { type: "string", allowNull: true },
      date: "date",
      note: "string",
      important: { type: "boolean", allowNull: true },
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
      name: { type: "string" },
      email: "string",
      planned_date: { type: "date" },
      another_date: "date",
      user_type: { type: "enum", values: ["Admin", "User"] },
    },
    relationships: {
      todo: {
        schema: "Todo",
        type: "many",
      },
    },
  },
  Planner: {
    name: "Planner",
    displayAttribute: "title",
    attributes: {
      title: "string",
    },
  },
}

describe("components/useFilterableFields", () => {
  it("It has related fields if include is passed in with a value", async () => {
    const { result } = renderHook(() =>
      useFilterableFields(schemas, "Todo", ["user"]),
    )

    //boolean types are not supported yet, so important attribute is not returned
    await waitFor(() => {
      expect(result.current).toEqual([
        "name",
        "date",
        "note",
        "status",
        "user.name",
        "user.email",
        "user.planned_date",
        "user.another_date",
        "user.user_type",
      ])
    })
  })

  it("It does not have related fields if include is empty", async () => {
    const { result } = renderHook(() =>
      useFilterableFields(schemas, "Todo", []),
    )

    //boolean types are not supported yet, so important attribute is not returned
    await waitFor(() => {
      expect(result.current).toEqual(["name", "date", "note", "status"])
    })
  })

  it("It adds fields that are a string instead of an object", async () => {
    const { result } = renderHook(() =>
      useFilterableFields(schemas, "User", []),
    )

    await waitFor(() => {
      expect(result.current).toEqual([
        "name",
        "email",
        "planned_date",
        "another_date",
        "user_type",
      ])
    })
  })

  it("It works on schemas that do not have relationships", async () => {
    const { result } = renderHook(() =>
      useFilterableFields(schemas, "Planner", []),
    )

    await waitFor(() => {
      expect(result.current).toEqual(["title"])
    })
  })
})
