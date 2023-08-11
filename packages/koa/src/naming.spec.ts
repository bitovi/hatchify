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
  skip?: boolean
  description: string
  models: HatchifyModel[]
  requests: Request[]
  database: Table[]
}

describe("Naming rules", () => {
  const schemaNameTestCases: TestCase[] = [
    {
      description: "Ensure basic schema for SalesPerson works (Schema.name)",
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
          url: "/api/sales-persons",
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
                  id: "1",
                  attributes: { name: "Roye" },
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

  //Temporarily commented, fix will be done by: https://bitovi.atlassian.net/browse/HATCH-310
  /* const pluralNameTestCases: TestCase[] = [
    {
      description: "Ensure pluralName creates route with correct name (Schema.pluralName)",
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
              meta: { unpaginatedCount: 1 },
              data: {
                  type: "SalesPerson",
                  id: "1",
                  attributes: { name: "Roye" },
                },
              ,
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
      ],
      database: [],
    },
  ] */

  const attributeNameTestCases: TestCase[] = [
    {
      description:
        "Ensure attribute's names create correct rows and can be fetched (Schema.attributes.ATTRIBUTE_NAME)",
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
          url: "/api/sales-persons",
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
  ]

  //Temporarily skipped, fix will be done by: https://bitovi.atlassian.net/browse/HATCH-320
  const belongsToTestCases: TestCase[] = [
    {
      skip: true,
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
      skip: true,
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
  ]

  const belongsToManyTestCases: TestCase[] = [
    {
      description:
        "Ensure belongsToMany attributes are correctly created as rows and can be fetched (relationships.belongsToMany.options.foreignKey)",
      models: [
        {
          name: "SalesPerson",
          attributes: {
            firstName: "STRING",
          },
          belongsToMany: [
            {
              target: "Account",
              options: {
                foreignKey: "seller_id",
                through: "account_sales_person",
              },
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
      description:
        "Ensure belongsToMany through works properly (relationships.belongsToMany.options.through)",
      models: [
        {
          name: "SalesPerson",
          attributes: {
            firstName: "STRING",
          },
          belongsToMany: [
            {
              target: "Account",
              options: { through: "sales_account" },
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
    //Temporarily skipped, fix will be done by: https://bitovi.atlassian.net/browse/HATCH-320
    {
      skip: true,
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
              options: { as: "salesAccounts", through: "sales_account" },
            },
          ],
        },
        {
          name: "Account",
          attributes: {
            name: "STRING",
          },
          belongsToMany: [
            {
              target: "SalesPerson",
              options: { as: "salesPerson", through: "sales_account" },
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
                attributes: { name: "Ana" },
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
                attributes: { name: "Ana" },
              },
            },
            status: 200,
          },
        },
        {
          url: "/api/sales-persons",
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
              },
            },
            status: 200,
          },
        },
        {
          url: "/api/sales-persons?include=salesAccounts",
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
                  id: "1",
                  attributes: { firstName: "Roye" },
                  relationships: {
                    salesAccounts: {
                      data: [{ type: "Account", id: "456" }],
                    },
                  },
                },
              ],
            },
            status: 200,
          },
        },
      ],
      database: [],
    },
    {
      description:
        "Ensure belongsToMany foreignKey is correctly created (relationships.belongsToMany.foreignKey)",
      models: [
        {
          name: "SalesPerson",
          attributes: {
            firstName: "STRING",
          },
          belongsToMany: [
            {
              target: "Account",
              options: {
                foreignKey: "seller_id",
                through: "account_sales_person",
              },
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
      description:
        "Ensure belongsToMany otherKey works properly (relationships.belongsToMany.otherKey)",
      models: [
        {
          name: "SalesPerson",
          attributes: {
            firstName: "STRING",
          },
          belongsToMany: [
            {
              target: "Account",
              options: {
                otherKey: "sold_account_id",
                through: "account_sales_person",
              },
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
              options: { as: "salesperson" },
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
  ]

  const hasManyTestCases: TestCase[] = [
    {
      description:
        "Ensure hasMany creates rows and is returned in include (relationships.hasMany)",
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
                attributes: { name: "Developer" },
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
                attributes: { name: "Developer" },
              },
            },
            status: 200,
          },
        },
        {
          url: "/api/sales-persons",
          options: {
            method: "post",
            body: {
              data: {
                type: "SalesPerson",
                id: "1",
                attributes: { firstName: "Roye" },
                relationships: {
                  accounts: { data: [{ type: "Account", id: "456" }] },
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
              },
            },
            status: 200,
          },
        },
        {
          url: "/api/sales-persons?include=accounts",
          options: {
            method: "get",
          },
          expected: {
            body: {
              jsonapi: {
                version: "1.0",
              },
              meta: {
                unpaginatedCount: 1,
              },
              data: [
                {
                  type: "SalesPerson",
                  id: "1",
                  attributes: { firstName: "Roye" },
                  relationships: {
                    accounts: { data: [{ type: "Account", id: "456" }] },
                  },
                },
              ],
              included: [
                {
                  type: "Account",
                  id: "456",
                  attributes: { name: "Developer" },
                },
              ],
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
    //Temporarily skipped, fix will be done by: https://bitovi.atlassian.net/browse/HATCH-320
    {
      skip: true,
      description:
        "Ensure hasMany foreignKey row is correctly created (relationships.hasMany.foreignKey)",
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
      skip: true,
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
          url: "/api/sales-persons",
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
          url: "/api/sales-persons?include=managingAccounts",
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
  ]

  const [skippedCases, cases] = [
    ...schemaNameTestCases,
    /*  ...pluralNameTestCases,*/
    ...attributeNameTestCases,
    ...belongsToTestCases,
    ...hasManyTestCases,
    ...belongsToManyTestCases,
  ].reduce(
    (acc: TestCase[][], curr: TestCase) => {
      if (curr.skip) {
        acc[0].push(curr)
      } else {
        acc[1].push(curr)
      }
      return acc
    },
    [[], []],
  )

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

  skippedCases.forEach(({ description }) => {
    it.skip(`${description}`, () => {})
  })
})
