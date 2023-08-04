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
  //Temporarily commented, fix will be done by: https://bitovi.atlassian.net/browse/HATCH-296 and https://bitovi.atlassian.net/browse/HATCH-297
  /* const schemaNameTestCases: TestCase[] = [
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
          url: "/api/api/sales-persons",
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
          url: "/api/api/sales-persons?fields[SalesPerson]=name",
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
  ] */

  //Temporarily commented, fix will be done by: https://bitovi.atlassian.net/browse/HATCH-296 and https://bitovi.atlassian.net/browse/HATCH-297
  /*   const pluralNameTestCases: TestCase[] = [
    {
      description: "Ensure pluralName creates route with correct name",
      models: [
        {
          name: "SalesPerson",
          pluralName: "SalesPeople",
          attributes: {
            firstName: "Roye",
          },
        },
      ],
      requests: [
        {
          url: "/api/sales-people",
          options: {
            method: "post",
            body: {
              data: {
                type: "SalesPerson",
              },
            },
          },
          expected: {
            body: {
              jsonapi: {
                version: "1.0",
              },
              data: {
                id: "1",
                type: "SalesPerson",
              },
            },
            status: 200,
          },
        },
        {
          url: "/api/api/sales-persons",
          options: {
            method: "get",
          },
          expected: {
            body: {},
            status: 404,
          },
        },
      ],
      database: [],
    },
  ] */

  //Temporarily commented, fix will be done by: https://bitovi.atlassian.net/browse/HATCH-296 and https://bitovi.atlassian.net/browse/HATCH-297
  /*  const attributeNameTestCases: TestCase[] = [
    {
      description:
        "Ensure attribute's names create correct rows and can be fetched",
      models: [
        {
          name: "SalesPerson",
          attributes: {
            firstName: "STRING",
          },
        },
      ],
      requests: [
        {
          url: "/api/api/sales-persons",
          options: {
            method: "post",
            body: {
              data: {
                type: "SalesPerson",
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
                id: "1",
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
  ] */

  //Temporarily commented, fix will be done by: https://bitovi.atlassian.net/browse/HATCH-296 and https://bitovi.atlassian.net/browse/HATCH-297
  /*   const belongsToTestCases: TestCase[] = [
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
          url: "/api/accounts",
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
          url: "/api/accounts?include=closerPerson",
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
    {
      description: "Ensure belongsTo foreign key is correctly created",
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
            {
              target: "SalesPerson",
              options: { as: "closerPerson", foreignKey: "finisher_id" },
            },
          ],
        },
      ],
      requests: [
        {
          url: "/api/accounts",
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
          url: "/api/accounts?include=closerPerson",
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
          columns: ["id", "finisher_id"],
        },
      ],
    },
  ] */

  //Temporarily commented, fix will be done by: https://bitovi.atlassian.net/browse/HATCH-296 and https://bitovi.atlassian.net/browse/HATCH-297
  /* const belongsToManyTestCases: TestCase[] = [
    {
      description:
        "Ensure belongsToMany attributes are correctly created as rows and can be fetched",
      models: [
        {
          name: "SalesPerson",
          attributes: {
            firstName: "STRING",
          },
          belongsToMany: [
            {
              target: "Account",
              options: { foreignKey: "seller_id", through: "SalesAccount" },
            },
          ],
        },
        {
          name: "Account",
          attributes: {
            name: "STRING",
          },
          hasOne: [
            {
              target: "SalesPerson",
            },
          ],
        },
      ],
      requests: [],
      database: [
        {
          tableName: "account_sales_person",
          columns: ["seller_id", "account_id"],
        },
      ],
    },
    {
      description: "Ensure belongsToMany through works properly",
      models: [
        {
          name: "SalesPerson",
          attributes: {
            firstName: "STRING",
          },
          belongsToMany: [
            {
              target: "Account",
              options: { through: "SalesAccount" },
            },
          ],
        },
        {
          name: "Account",
          attributes: {
            name: "STRING",
          },
          hasOne: [
            {
              target: "SalesPerson",
            },
          ],
        },
      ],
      requests: [],
      database: [
        {
          tableName: "sales_account",
          columns: ["sales_person_id", "account_id"],
        },
      ],
    },
    {
      description: "Ensure belongsToMany alias (as) is correctly returned",
      models: [
        {
          name: "SalesPerson",
          attributes: {
            firstName: "STRING",
          },
          belongsToMany: [
            {
              target: "Account",
              options: { as: "salesAccounts", through: "SalesAccount" },
            },
          ],
        },
        {
          name: "Account",
          attributes: {
            name: "STRING",
          },
          hasOne: [
            {
              target: "SalesPerson",
            },
          ],
        },
      ],
      requests: [
        {
          url: "/api/sales-person",
          options: {
            method: "post",
            body: {
              data: {
                type: "SalesPerson",
                id: "1",
                attributes: { firstName: "Roye" },
                relationships: {
                  salesAccounts: {
                    data: [{ type: "Account", id: "456" }],
                  },
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
                type: "SalesPerson",
                id: "1",
                attributes: { firstName: "Roye" },
                relationships: {
                  salesAccounts: {
                    data: [{ type: "Account", id: "456" }],
                  },
                },
              },
            },
            status: 200,
          },
        },
        {
          url: "/api/api/sales-persons?include=managingAccounts",
          options: {
            method: "get",
          },
          expected: {
            body: {
              jsonapi: {
                version: "1.0",
              },
              data: {
                type: "SalesPerson",
                id: "1",
                attributes: { firstName: "Roye" },
                relationships: {
                  salesAccounts: {
                    data: [{ type: "Account", id: "456" }],
                  },
                },
              },
            },
            status: 200,
          },
        },
      ],
      database: [],
    },
    {
      description: "Ensure belongsToMany foreignKey is correctly created",
      models: [
        {
          name: "SalesPerson",
          attributes: {
            firstName: "STRING",
          },
          belongsToMany: [
            {
              target: "Account",
              options: { foreignKey: "seller_id", through: "SalesAccount" },
            },
          ],
        },
        {
          name: "Account",
          attributes: {
            name: "STRING",
          },
          hasOne: [
            {
              target: "SalesPerson",
            },
          ],
        },
      ],
      requests: [],
      database: [
        {
          tableName: "account_sales_person",
          columns: ["seller_id", "account_id"],
        },
      ],
    },
    {
      description: "Ensure belongsToMany otherKey works properly",
      models: [
        {
          name: "SalesPerson",
          attributes: {
            firstName: "STRING",
          },
          belongsToMany: [
            {
              target: "Account",
              options: { otherKey: "sold_account_id", through: "SalesAccount" },
            },
          ],
        },
        {
          name: "Account",
          attributes: {
            name: "STRING",
          },
          hasOne: [
            {
              target: "SalesPerson",
            },
          ],
        },
      ],
      requests: [],
      database: [
        {
          tableName: "account_sales_person",
          columns: ["sales_person_id", "sold_account_id"],
        },
      ],
    },
  ] */

  //Temporarily commented, fix will be done by: https://bitovi.atlassian.net/browse/HATCH-296 and https://bitovi.atlassian.net/browse/HATCH-297
  /* const hasManyTestCases: TestCase[] = [
    {
      description: "Ensure hasMany creates rows and is returned in include",
      models: [
        {
          name: "SalesPerson",
          attributes: {
            firstName: "STRING",
          },
          hasMany: [{ target: "Account" }],
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
      requests: [
        {
          url: "/api/accounts",
          options: {
            method: "post",
            body: {
              data: {
                type: "Account",
                id: "456",
                attributes: { firstName: "Acme" },
                relationships: {
                  closerPerson: { type: "SalesPerson", id: "1" },
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
                id: "456",
                attributes: { firstName: "Acme" },
                relationships: {
                  closerPerson: [{ type: "SalesPerson", id: "1" }],
                },
              },
            },
            status: 200,
          },
        },
        {
          url: "/api/api/sales-persons?include=accounts",
          options: {
            method: "get",
          },
          expected: {
            body: {
              jsonapi: {
                version: "1.0",
              },
              data: {
                type: "SalesPerson",
                id: "1",
                attributes: { firstName: "Roye" },
                relationships: {
                  closerPerson: { type: "Account", id: "456" },
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
          columns: ["id", "sales_person_id"],
        },
      ],
    },
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
    {
      description: "Ensure hasMany alias (as) is correctly addressed",
      models: [
        {
          name: "SalesPerson",
          attributes: {
            firstName: "STRING",
          },
          hasMany: [{ target: "Account", options: { as: "managingAccounts" } }],
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
      requests: [
        {
          url: "/api/sales-person",
          options: {
            method: "post",
            body: {
              data: {
                type: "SalesPerson",
                id: "1",
                attributes: { firstName: "Roye" },
                relationships: {
                  managingAccounts: {
                    data: [{ type: "Account", id: "456" }],
                  },
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
                type: "SalesPerson",
                id: "1",
                attributes: { firstName: "Roye" },
                relationships: {
                  managingAccounts: {
                    data: [{ type: "Account", id: "456" }],
                  },
                },
              },
            },
            status: 200,
          },
        },
        {
          url: "/api/api/sales-persons?include=managingAccounts",
          options: {
            method: "get",
          },
          expected: {
            body: {
              jsonapi: {
                version: "1.0",
              },
              data: {
                type: "SalesPerson",
                id: "1",
                attributes: { firstName: "Roye" },
                relationships: {
                  managingAccounts: {
                    data: [{ type: "Account", id: "456" }],
                  },
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
          columns: ["id", "sales_person_id"],
        },
      ],
    },
  ] */

  const cases: TestCase[] = [
    /*    ...schemaNameTestCases,
    ...pluralNameTestCases,
    ...attributeNameTestCases,
    ...belongsToTestCases,
    ...hasManyTestCases,
    ...belongsToManyTestCases, */
  ]

  let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
  let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]
  let hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"]

  afterAll(async () => {
    await teardown()
  })

  it.each(cases)(
    "$description",
    async ({ description, models, database, requests }) => {
      ;({ fetch, teardown, hatchify } = await startServerWith(models))

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
