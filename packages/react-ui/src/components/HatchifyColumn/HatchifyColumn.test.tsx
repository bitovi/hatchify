import "@testing-library/jest-dom"
import { render } from "@testing-library/react"
import { describe, it } from "vitest"
import { assembler, integer } from "@hatchifyjs/core"
import { HatchifyColumn } from "./HatchifyColumn.js"

describe("components/HatchifyColumn", () => {
  const partialSchemas = {
    Todo: {
      name: "Todo",
      attributes: {
        importance: integer(),
      },
    },
  }

  const finalSchemas = assembler(partialSchemas)

  it("HatchifyColumn renders", async () => {
    render(<HatchifyColumn allSchemas={finalSchemas} schemaName="Todo" />)
  })
})
