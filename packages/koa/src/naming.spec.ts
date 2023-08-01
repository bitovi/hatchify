import type { HatchifyModel, ModelAttributes } from "@hatchifyjs/node"
import type { Model } from "sequelize"

import { startServerWith } from "./testing/utils"

type Method = "get" | "post" | "patch" | "delete"

interface Request {
  url: string
  options: {
    method: Method
    body: Record<string, unknown>
  }
  expected: Record<string, unknown>
}

interface Table {
  tableName: string
  columns: string[]
}
interface TestCase {
  description: string
  model: {
    name: string
    attributes: ModelAttributes<Model<any, any>, unknown>
    pluralName?: string
  }
  requests: Request[]
  database: Table[]
}

describe("Naming rules", () => {
  const schemaNameTestCases: TestCase[] = [
    {
      description: "Ensure basic schema for SalesPerson works",
      model: {
        name: "SalesPerson",
      },
      requests: [
        {
          url: "/sales-persons",
          options: {
            method: "post",
            body: {
              data: {
                type: "SalesPerson",
              },
            },
          },
          expected: {
            jsonapi: {
              version: "1.0",
            },
            data: {
              id: "1",
              type: "SalesPerson",
            },
          },
        },
        {
          url: "/sales-persons?fields[SalesPerson]=name",
          options: {
            method: "post",
            body: {
              data: {
                type: "SalesPerson",
                attributes: {
                  name: "John Doe",
                },
              },
            },
          },
          expected: {
            jsonapi: {
              version: "1.0",
            },
            data: {
              id: "1",
              type: "SalesPerson",
              attributes: {
                name: "John Doe",
              },
            },
          },
        },
      ],
      database: [
        {
          tableName: "sales_person",
          columns: ["id", "name"],
        },
      ],
    },
  ]

  const cases: TestCase[] = [...schemaNameTestCases]

  let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
  let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]
  let hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"]

  afterAll(async () => {
    await teardown()
  })

  it.each(cases)(
    "$description",
    async ({ description, model, database, requests }) => {
      const Account: HatchifyModel = model
      ;({ fetch, teardown, hatchify } = await startServerWith([Account]))

      for (const request of requests) {
        const { expected, options, url } = request

        const { body } = await fetch(url, options)

        expect(body).toStrictEqual(expected)
      }

      for (const table of database) {
        const { columns: expectedColumns, tableName } = table

        const [dbResult] = await hatchify._sequelize.query(
          `SELECT * FROM ${tableName}`,
        )

        const columns = Object.keys(dbResult[0])

        expect(columns).toEqual(expect.arrayContaining(expectedColumns))
      }
    },
  )
})
