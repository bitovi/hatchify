import { string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/node"

import { startServerWith } from "./testing/utils.js"

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
  schemas: Record<string, PartialSchema>
  requests: Request[]
  database: Table[]
}

describe("Naming rules", () => {
  const schemaNameTestCases: TestCase[] = [
    {
      description: "Ensure basic schema for SalesPerson works (Schema.name)",
      schemas: {
        SalesPerson: {
          name: "SalesPerson",
          attributes: {
            name: string(),
          },
        },
      },
      requests: [
        {
          url: "/api/sales-persons",
          options: {
            method: "post",
            body: {
              data: {
                type: "SalesPerson",
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                attributes: { name: "Mary" },
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
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                attributes: { name: "Mary" },
              },
            },
            status: 200,
          },
        },
        {
          url: "/api/sales-persons?fields[SalesPerson]=name",
          options: {
            method: "get",
          },
          expected: {
            body: {
              jsonapi: {
                version: "1.0",
              },
              meta: { unpaginatedCount: 1 },
              data: [
                {
                  type: "SalesPerson",
                  id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                  attributes: { name: "Mary" },
                },
              ],
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

  const pluralNameTestCases: TestCase[] = [
    {
      description:
        "Ensure pluralName creates route with correct name (Schema.pluralName)",
      schemas: {
        SalesPerson: {
          name: "SalesPerson",
          pluralName: "SalesPeople",
          attributes: {
            name: string(),
          },
        },
        Tenancy_DocumentLibrary: {
          name: "DocumentLibrary",
          namespace: "Tenancy",
          pluralName: "DocumentLibrary",
          attributes: {
            name: string(),
          },
        },
      },
      requests: [
        {
          url: "/api/sales-people",
          options: {
            method: "post",
            body: {
              data: {
                type: "SalesPerson",
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                attributes: { name: "Mary" },
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
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                attributes: { name: "Mary" },
              },
            },
            status: 200,
          },
        },
        {
          url: "/api/sales-persons",
          options: {
            method: "get",
          },
          expected: {
            body: {},
            status: 404,
          },
        },
        {
          url: "/api/tenancy/document-library",
          options: {
            method: "post",
            body: {
              data: {
                type: "Tenancy_DocumentLibrary",
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                attributes: { name: "Mary" },
              },
            },
          },
          expected: {
            body: {
              jsonapi: {
                version: "1.0",
              },
              data: {
                type: "Tenancy_DocumentLibrary",
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                attributes: { name: "Mary" },
              },
            },
            status: 200,
          },
        },
      ],
      database: [],
    },
  ]
  const attributeNameTestCases: TestCase[] = [
    {
      description:
        "Ensure attribute's names create correct rows and can be fetched (Schema.attributes.ATTRIBUTE_NAME)",
      schemas: {
        SalesPerson: {
          name: "SalesPerson",
          attributes: {
            firstName: string(),
          },
        },
      },
      requests: [
        {
          url: "/api/sales-persons",
          options: {
            method: "post",
            body: {
              data: {
                type: "SalesPerson",
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                attributes: { firstName: "John Doe" },
              },
            },
          },
          expected: {
            body: {
              jsonapi: {
                version: "1.0",
              },
              data: {
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                type: "SalesPerson",
                attributes: { firstName: "John Doe" },
              },
            },
            status: 200,
          },
        },
      ],
      database: [
        {
          tableName: "sales_person",
          columns: ["id", "first_name"],
        },
      ],
    },
  ]

  const cases = [
    ...schemaNameTestCases,
    ...pluralNameTestCases,
    ...attributeNameTestCases,
  ]

  let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
  let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]
  let hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"]

  afterAll(async () => {
    await teardown()
  })

  it.each(cases)("$description", async ({ schemas, database, requests }) => {
    ;({ fetch, teardown, hatchify } = await startServerWith(schemas))

    for (const request of requests) {
      const { expected, options, url } = request
      const { body: expectedBody, status: expectedStatus } = expected
      const { body, status } = await fetch(url, options)

      expect(status).toStrictEqual(expectedStatus)
      expect(body).toStrictEqual(expectedBody)
    }

    for (const table of database) {
      const { columns: expectedColumns, tableName } = table
      const [dbResult] = await hatchify.orm.query(
        `SELECT name FROM pragma_table_info("${tableName}")`,
      )
      const columns = (dbResult as Array<{ name: string }>).map(
        (row) => row.name,
      )

      expect(columns).toEqual(expect.arrayContaining(expectedColumns))
    }
  })
})
