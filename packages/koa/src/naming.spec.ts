import { belongsTo, hasMany, hasOne, string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/node"
import { jest } from "@jest/globals"

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
  skip?: boolean
  description: string
  models: Record<string, PartialSchema>
  requests: Request[]
  database: Table[]
}

describe("Naming rules", () => {
  const schemaNameTestCases: TestCase[] = [
    {
      description: "Ensure basic schema for SalesPerson works (Schema.name)",
      models: {
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
      models: {
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
      models: {
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
  //Temporarily skipped, fix will be done by: https://bitovi.atlassian.net/browse/HATCH-320
  const belongsToTestCases: TestCase[] = [
    {
      skip: true,
      description: "Ensure belongsTo creates rows and is returned in include",
      models: {
        SalesPerson: {
          name: "SalesPerson",
          attributes: {
            name: string(),
          },
        },
        Account: {
          name: "Account",
          attributes: {
            name: string(),
          },
          relationships: {
            closerPerson: belongsTo("SalesPerson"),
          },
        },
      },
      requests: [
        {
          url: "/api/accounts",
          options: {
            method: "post",
            body: {
              data: {
                type: "Account",
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
      models: {
        SalesPerson: {
          name: "SalesPerson",
          attributes: {
            name: string(),
          },
        },
        Account: {
          name: "Account",
          attributes: {
            name: string(),
          },
          relationships: {
            closerPerson: belongsTo("SalesPerson", {
              sourceAttribute: "finisherId",
            }),
          },
        },
      },
      requests: [
        {
          url: "/api/accounts",
          options: {
            method: "post",
            body: {
              data: {
                type: "Account",
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
      models: {
        SalesPerson: {
          name: "SalesPerson",
          attributes: {
            firstName: string(),
          },
          relationships: {
            accounts: hasMany().through(null, {
              throughSourceAttribute: "sellerId",
              throughTargetAttribute: "accountId",
            }),
          },
        },
        Account: {
          name: "Account",
          attributes: {
            name: string(),
          },
          relationships: {
            salesPerson: hasOne(),
          },
        },
      },
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
      models: {
        SalesPerson: {
          name: "SalesPerson",
          attributes: {
            firstName: string(),
          },
          relationships: {
            accounts: hasMany("Account").through("SalesAccount"),
          },
        },
        Account: {
          name: "Account",
          attributes: {
            name: string(),
          },
          relationships: {
            salesPerson: hasOne(),
          },
        },
      },
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
      models: {
        SalesPerson: {
          name: "SalesPerson",
          attributes: {
            firstName: string(),
          },
          relationships: {
            salesAccounts: hasMany("Account").through("SalesAccount"),
          },
        },
        Account: {
          name: "Account",
          attributes: {
            name: string(),
          },
          relationships: {
            salesPersons: hasMany("SalesPerson").through("SalesAccount"),
          },
        },
      },
      requests: [
        {
          url: "/api/accounts",
          options: {
            method: "post",
            body: {
              data: {
                type: "Account",
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                attributes: { firstName: "Mary" },
                relationships: {
                  salesAccounts: {
                    data: [
                      {
                        type: "Account",
                        id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                      },
                    ],
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
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                attributes: { firstName: "Mary" },
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
                  id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                  attributes: { firstName: "Mary" },
                  relationships: {
                    salesAccounts: {
                      data: [
                        {
                          type: "Account",
                          id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                        },
                      ],
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
      models: {
        SalesPerson: {
          name: "SalesPerson",
          attributes: {
            firstName: string(),
          },
          relationships: {
            salesAccounts: hasMany("Account").through(null, {
              throughSourceAttribute: "sellerId",
              throughTargetAttribute: "accountId",
            }),
          },
        },
        Account: {
          name: "Account",
          attributes: {
            name: string(),
          },
          relationships: {
            salesPerson: hasOne(),
          },
        },
      },
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
      models: {
        SalesPerson: {
          name: "SalesPerson",
          attributes: {
            firstName: string(),
          },
          relationships: {
            salesAccounts: hasMany("Account").through(null, {
              throughSourceAttribute: "salesPersonId",
              throughTargetAttribute: "soldAccountId",
            }),
          },
        },
        Account: {
          name: "Account",
          attributes: {
            name: string(),
          },
          relationships: {
            salesPerson: hasOne("SalesPerson"),
          },
        },
      },
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
      models: {
        SalesPerson: {
          name: "SalesPerson",
          attributes: {
            firstName: string(),
          },
          relationships: {
            accounts: hasMany(),
          },
        },
        Account: {
          name: "Account",
          attributes: {
            name: string(),
          },
          relationships: {
            salesPerson: belongsTo(),
          },
        },
      },
      requests: [
        {
          url: "/api/accounts",
          options: {
            method: "post",
            body: {
              data: {
                type: "Account",
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                attributes: { firstName: "Mary" },
                relationships: {
                  accounts: {
                    data: [
                      {
                        type: "Account",
                        id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                      },
                    ],
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
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                attributes: { firstName: "Mary" },
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
                  id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                  attributes: { firstName: "Mary" },
                  relationships: {
                    accounts: {
                      data: [
                        {
                          type: "Account",
                          id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                        },
                      ],
                    },
                  },
                },
              ],
              included: [
                {
                  type: "Account",
                  id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                  attributes: {
                    name: "Developer",
                    salesPersonId: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                  },
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
      models: {
        SalesPerson: {
          name: "SalesPerson",
          attributes: {
            firstName: string(),
          },
          relationships: {
            openedAccounts: hasMany("Account", {
              targetAttribute: "openingSalesPersonId",
            }),
          },
        },
        Account: {
          name: "Account",
          attributes: {
            name: string(),
          },
          relationships: {
            closerPerson: belongsTo("SalesPerson", {
              sourceAttribute: "finisherId",
            }),
          },
        },
      },
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
      models: {
        SalesPerson: {
          name: "SalesPerson",
          attributes: {
            firstName: string(),
          },
          relationships: {
            managingAccounts: hasMany("Account"),
          },
        },
        Account: {
          name: "Account",
          attributes: {
            name: string(),
          },
          relationships: {
            closerPerson: belongsTo("SalesPerson", {
              sourceAttribute: "finisherId",
            }),
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
                attributes: { firstName: "Mary" },
                relationships: {
                  managingAccounts: {
                    data: [
                      {
                        type: "Account",
                        id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                      },
                    ],
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
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                attributes: { firstName: "Mary" },
                relationships: {
                  managingAccounts: {
                    data: [
                      {
                        type: "Account",
                        id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                      },
                    ],
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
                id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                attributes: { firstName: "Mary" },
                relationships: {
                  managingAccounts: {
                    data: [
                      {
                        type: "Account",
                        id: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                      },
                    ],
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
    ...pluralNameTestCases,
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
    },
  )

  skippedCases.forEach(({ description }) => {
    it.skip(`${description}`, jest.fn() as any)
  })
})
