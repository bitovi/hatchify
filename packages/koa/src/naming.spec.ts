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
      description: "Ensure belongsTo creates rows and is returned in include",
      models: [
        {
          name: "SalesPerson",
          attributes: {
            name: "STRING",
          },
        },
        {
          name: "Account",
          attributes: {
            name: "STRING",
          },
          belongsTo: [
            { target: "SalesPerson", options: { as: "closerPerson" } },
          ],
        },
      ],
      requests: [
        {
          url: "/accounts",
          options: {
            method: "post",
            body: {
              data: {
                type: "Account",
                id: "1",
                attributes: { firstName: "Acme" },
                relationships: {
                  closerPerson: { type: "SalesPerson", id: "322" },
                },
              },
            },
          },
          expected: {
            body: {
              jsonapi: {
                version: "1.0",
              },
              data: {
                type: "Account",
                id: "1",
                attributes: { firstName: "Acme" },
                relationships: {
                  closerPerson: { type: "SalesPerson", id: "322" },
                },
              },
            },
            status: 200,
          },
        },
        {
          url: "/accounts?include=closerPerson",
          options: {
            method: "get",
          },
          expected: {
            body: {
              jsonapi: {
                version: "1.0",
              },
              data: {
                type: "Account",
                id: "1",
                attributes: { firstName: "Acme" },
                relationships: {
                  closerPerson: { type: "SalesPerson", id: "322" },
                },
              },
            },
            status: 200,
          },
        },
      ],
      database: [
        {
          tableName: "account",
          columns: ["id", "closer_person_id"],
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
      ;({ fetch, teardown, hatchify } = await startServerWith([...models]))

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
          `SELECT * FROM ${tableName}`,
        )

        const columns = Object.keys(dbResult[0])

        expect(columns).toEqual(expect.arrayContaining(expectedColumns))
      }
    },
  )
})
