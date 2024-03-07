import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { MuiProvider } from "."
import hatchifyReact from "@hatchifyjs/react-ui"
import type { RestClient } from "@hatchifyjs/rest-client"
import { boolean, string } from "@hatchifyjs/core"

describe("MuiProvider", () => {
  it("accepts defaultDisplayComponents and renders them", async () => {
    const schemas = {
      Todo: {
        name: "Todo",
        attributes: {
          name: string(),
          done: boolean(),
        },
      },
    }
    const fakeDataSource: RestClient<typeof schemas, keyof typeof schemas> = {
      completeSchemaMap: schemas,
      version: 0,
      findAll: () =>
        Promise.resolve([
          {
            records: [
              {
                id: "1",
                __schema: "Todo",
                attributes: { name: "Workout", done: false },
              },
            ],
            related: [],
          },
          {},
        ]),
      findOne: () => Promise.resolve({ record: {} as any, related: [] }),
      createOne: () => Promise.resolve({ record: {} as any, related: [] }),
      updateOne: () => Promise.resolve({ record: {} as any, related: [] }),
      deleteOne: () => Promise.resolve(),
    }

    const hatchify = hatchifyReact(fakeDataSource)
    const DataGrid = hatchify.components.Todo.DataGrid

    render(
      <MuiProvider
        defaultDisplayComponents={{
          Boolean: () => <div>Custom Boolean!</div>,
        }}
      >
        <DataGrid />
      </MuiProvider>,
    )

    await screen.findByText("Custom Boolean!")
  })
})
