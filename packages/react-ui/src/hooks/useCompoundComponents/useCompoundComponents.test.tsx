import "@testing-library/jest-dom"
import { renderHook } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { assembler, integer } from "@hatchifyjs/core"
import useCompoundComponents from "./useCompoundComponents.js"

describe("hooks/useCompoundComponents", () => {
  const finalSchemas = assembler({
    Todo: {
      name: "Todo",
      attributes: {
        importance: integer(),
      },
    },
  })

  it("Works", async () => {
    const { result } = renderHook(() =>
      useCompoundComponents(finalSchemas, "Todo", false, null),
    )

    expect(result.current).toEqual({
      Empty: expect.any(Function),
      columns: [
        {
          headerOverride: false,
          key: "importance",
          label: "Importance",
          renderData: expect.any(Function),
          renderHeader: expect.any(Function),
          sortable: true,
        },
      ],
    })
  })
})
