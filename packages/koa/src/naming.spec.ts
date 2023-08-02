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
  const attributeNameTestCases: TestCase[] = [
    {
      description: "Ensure hasMany foreignKey row is correctly created",
      models: [
        {
          name: "SalesPerson",
          attributes: {
            firstName: "STRING",
          },
          hasMany: [
            {
              target: "Account",
              options: {
                as: "openedAccounts",
                foreignKey: "opening_sales_person_id",
              },
            },
          ],
        },
        {
          name: "Account",
          attributes: {
            name: "STRING",
          },
          belongsTo: [
            {
              target: "SalesPerson",
              options: { as: "closerPerson", foreignKey: "finisher_id" },
            },
          ],
        },
      ],
      requests: [],
      database: [
        {
          tableName: "account",
          columns: ["id", "opening_sales_person_id"],
        },
      ],
    },
  ]

  const cases: TestCase[] = [...attributeNameTestCases]

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
