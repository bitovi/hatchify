import "@testing-library/jest-dom"
import { render } from "@testing-library/react"
import { describe, it } from "vitest"
import { assembler, integer } from "@hatchifyjs/core"
import { HatchifyEverything } from "./HatchifyEverything.js"
import hatchifyReactRest from "@hatchifyjs/react-rest"

describe("components/HatchifyEverything/components/HatchifyEverything", () => {
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
      <HatchifyEverything
        partialSchemas={partialSchemas}
        finalSchemas={finalSchemas}
        restClient={fakeRestClient}
      />,
    )
  })

  it("Works with no schemas", async () => {
    render(
      <HatchifyEverything
        partialSchemas={partialSchemas}
        finalSchemas={{}}
        restClient={fakeRestClient}
      />,
    )
  })
})
