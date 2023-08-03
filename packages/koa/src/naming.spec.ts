import type { HatchifyModel } from "@hatchifyjs/node"

import { startServerWith } from "./testing/utils"

type Method = "get" | "post" | "patch" | "delete"

interface Request {
  url: string
  options: {
    method: Method
    body?: Record<string, unknown>
  }
  expected: {
    body: Record<string, unknown>
    status: number
  }
}

interface Table {
  tableName: string
  columns: string[]
}
interface TestCase {
  description: string
  models: HatchifyModel[]
  requests: Request[]
  database: Table[]
}

describe("Naming rules", () => {
  const schemaNameTestCases: TestCase[] = [
    {
      description: "Ensure basic schema for SalesPerson works",
      models: [
        {
          name: "SalesPerson",
          attributes: {
            name: "STRING",
          },
        },
      ],
      requests: [
        {
          url: "/sales-persons",
          options: {
            method: "post",
            body: {
              data: {
                type: "SalesPerson",
                id: "1",
                attributes: { name: "Roye" },
              },
            },
          },
          expected: {
            body: {
              jsonapi: {
                version: "1.0",
              },
              data: {
                type: "SalesPerson",
                id: "1",
                attributes: { name: "Roye" },
              },
            },
            status: 200,
          },
        },
        {
          url: "/sales-persons?fields[SalesPerson]=name",
          options: {
            method: "post",
            body: {
              data: {
                type: "SalesPerson",
                id: "1",
                attributes: { name: "Roye" },
              },
            },
          },
          expected: {
            body: {
              jsonapi: {
                version: "1.0",
              },
              data: {
                type: "SalesPerson",
                id: "1",
                attributes: { name: "Roye" },
              },
            },
            status: 200,
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
    async ({ description, models, database, requests }) => {
      ;({ fetch, teardown, hatchify } = await startServerWith(
        [...models],
        false,
      ))

      for (const request of requests) {
        const { expected, options, url } = request
        const { body: expectedBody, status: expectedStatus } = expected

        const { body, status } = await fetch(url, options)

        expect(body).toStrictEqual(expectedBody)
        expect(status).toStrictEqual(expectedStatus)
      }

      for (const table of database) {
        const { columns: expectedColumns, tableName } = table

        const [dbResult] = await hatchify._sequelize.query(
          `SELECT name FROM pragma_table_info("${tableName}")`,
        )

        const columns = dbResult.map((row) => row.name)

        expect(columns).toEqual(expect.arrayContaining(expectedColumns))
      }
    },
  )
})
