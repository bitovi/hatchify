import "@testing-library/jest-dom"
import { render } from "@testing-library/react"
import { describe, it } from "vitest"
import { assembler, integer } from "@hatchifyjs/core"
import { default as HatchifyDataGrid } from "./HatchifyDataGrid.js"
import hatchifyReactRest from "@hatchifyjs/react-rest"

describe("components/HatchifyDataGrid", () => {
  const partialSchemas = {
    Todo: {
      name: "Todo",
      attributes: {
        importance: integer(),
      },
    },
  }

  const finalSchemas = assembler(partialSchemas)

  const fakeRestClient = hatchifyReactRest({
    version: 0,
    completeSchemaMap: partialSchemas,
    findAll: () =>
      Promise.resolve([
        {
          records: [
            {
              id: "1",
              __schema: "Todo",
              attributes: {
                name: "foo",
                created: "2021-01-01",
                important: true,
              },
            },
          ],
          related: [],
        },
        {
          unpaginatedCount: 1,
        },
      ]),
    findOne: () => Promise.resolve({ record: {} as any, related: [] }),
    createOne: () => Promise.resolve({ record: {} as any, related: [] }),
    updateOne: () => Promise.resolve({ record: {} as any, related: [] }),
    deleteOne: () => Promise.resolve(),
  })

  it("Works", async () => {
    render(
      <HatchifyDataGrid
        finalSchemas={finalSchemas}
        partialSchemas={partialSchemas}
        schemaName="Todo"
        restClient={fakeRestClient}
      />,
    )
  })
})
