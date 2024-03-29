import {
  belongsTo,
  hasMany,
  integer,
  string,
  uuid,
  uuidv4,
} from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/node"

import {
  dbDialects,
  getDatabaseColumns,
  startServerWith,
} from "./testing/utils.js"

describe.each(dbDialects)("Relationships v2", (dialect) => {
  describe(`${dialect} - belongsTo()`, () => {
    const SalesPerson = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
    } satisfies PartialSchema
    const Account = {
      name: "Account",
      attributes: {
        name: string(),
      },
      relationships: {
        salesPerson: belongsTo(),
      },
    } satisfies PartialSchema

    let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
    let hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"]
    let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

    beforeAll(async () => {
      ;({ fetch, hatchify, teardown } = await startServerWith(
        { SalesPerson, Account },
        dialect,
      ))
    })

    afterAll(async () => {
      await teardown()
    })

    it("creates a column sales_person_id in the account table", async () => {
      const sortedColumns = await getDatabaseColumns(hatchify, "account")

      expect(sortedColumns).toEqual(
        expect.arrayContaining([
          {
            name: "sales_person_id",
            allowNull: true,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
            foreignKeys: [
              {
                ...(dialect === "postgres" ? { schemaName: "public" } : {}),
                tableName: "sales_person",
                columnName: "id",
              },
            ],
          },
        ]),
      )
    })

    it("salesPerson will be used in the include query parameter, mutation payloads and response payloads", async () => {
      const { body: salesPerson } = await fetch("/api/sales-persons", {
        method: "post",
        body: {
          data: {
            type: "SalesPerson",
            attributes: {
              firstName: "John",
            },
          },
        },
      })
      const { body: account } = await fetch("/api/accounts", {
        method: "post",
        body: {
          data: {
            type: "Account",
            attributes: {
              name: "Acme",
            },
            relationships: {
              salesPerson: {
                data: {
                  type: "SalesPerson",
                  id: salesPerson.data.id,
                },
              },
            },
          },
        },
      })
      const { body: accounts } = await fetch(
        "/api/accounts?include=salesPerson",
      )
      expect(accounts).toEqual({
        jsonapi: { version: "1.0" },
        data: [
          {
            type: "Account",
            id: account.data.id,
            attributes: {
              name: "Acme",
              salesPersonId: salesPerson.data.id,
            },
            relationships: {
              salesPerson: {
                data: {
                  type: "SalesPerson",
                  id: salesPerson.data.id,
                },
              },
            },
          },
        ],
        included: [
          {
            type: "SalesPerson",
            id: salesPerson.data.id,
            attributes: {
              firstName: "John",
            },
          },
        ],

        meta: { unpaginatedCount: 1 },
      })
    })
  })

  describe(`${dialect} - belongsTo() mismatch`, () => {
    const Account = {
      name: "Account",
      attributes: {
        name: string(),
      },
      relationships: {
        foob: belongsTo(),
      },
    } satisfies PartialSchema

    it("throws for unknown schema", async () => {
      await expect(() => startServerWith({ Account }, dialect)).rejects.toThrow(
        "Schema 'Foob' is undefined",
      )
    })
  })

  describe(`${dialect} - belongsTo(schemaName)`, () => {
    const SalesPerson = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
    } satisfies PartialSchema
    const Account = {
      name: "Account",
      attributes: {
        name: string(),
      },
      relationships: {
        closerPerson: belongsTo("SalesPerson"),
      },
    } satisfies PartialSchema

    let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
    let hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"]
    let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

    beforeAll(async () => {
      ;({ fetch, hatchify, teardown } = await startServerWith(
        { SalesPerson, Account },
        dialect,
      ))
    })

    afterAll(async () => {
      await teardown()
    })

    it("creates a column closer_person_id in the account table", async () => {
      const sortedColumns = await getDatabaseColumns(hatchify, "account")

      expect(sortedColumns).toEqual(
        expect.arrayContaining([
          {
            name: "closer_person_id",
            allowNull: true,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
            foreignKeys: [
              {
                ...(dialect === "postgres" ? { schemaName: "public" } : {}),
                tableName: "sales_person",
                columnName: "id",
              },
            ],
          },
        ]),
      )
    })

    it("closerPerson will be used in the include query parameter, mutation payloads and response payloads", async () => {
      const { body: closerPerson } = await fetch("/api/sales-persons", {
        method: "post",
        body: {
          data: {
            type: "SalesPerson",
            attributes: {
              firstName: "John",
            },
          },
        },
      })
      const { body: account } = await fetch("/api/accounts", {
        method: "post",
        body: {
          data: {
            type: "Account",
            attributes: {
              name: "Acme",
            },
            relationships: {
              closerPerson: {
                data: {
                  type: "SalesPerson",
                  id: closerPerson.data.id,
                },
              },
            },
          },
        },
      })
      const { body: accounts } = await fetch(
        "/api/accounts?include=closerPerson",
      )
      expect(accounts).toEqual({
        jsonapi: { version: "1.0" },
        data: [
          {
            type: "Account",
            id: account.data.id,
            attributes: {
              name: "Acme",
              closerPersonId: closerPerson.data.id,
            },
            relationships: {
              closerPerson: {
                data: {
                  type: "SalesPerson",
                  id: closerPerson.data.id,
                },
              },
            },
          },
        ],
        included: [
          {
            type: "SalesPerson",
            id: closerPerson.data.id,
            attributes: {
              firstName: "John",
            },
          },
        ],

        meta: { unpaginatedCount: 1 },
      })
    })
  })

  describe(`${dialect} - belongsTo(schemaName, { sourceAttribute })`, () => {
    const SalesPerson = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
    } satisfies PartialSchema
    const Account = {
      name: "Account",
      attributes: {
        name: string(),
      },
      relationships: {
        salesPerson: belongsTo("SalesPerson", {
          sourceAttribute: "finisherId",
        }),
      },
    } satisfies PartialSchema

    let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
    let hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"]
    let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

    beforeAll(async () => {
      ;({ fetch, hatchify, teardown } = await startServerWith(
        { SalesPerson, Account },
        dialect,
      ))
    })

    afterAll(async () => {
      await teardown()
    })

    it("creates a column finisher_id in the account table", async () => {
      const sortedColumns = await getDatabaseColumns(hatchify, "account")

      expect(sortedColumns).toEqual(
        expect.arrayContaining([
          {
            name: "finisher_id",
            allowNull: true,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
            foreignKeys: [
              {
                ...(dialect === "postgres" ? { schemaName: "public" } : {}),
                tableName: "sales_person",
                columnName: "id",
              },
            ],
          },
        ]),
      )
    })

    it("salesPerson will be used in the include query parameter, mutation payloads and response payloads", async () => {
      const { body: salesPerson } = await fetch("/api/sales-persons", {
        method: "post",
        body: {
          data: {
            type: "SalesPerson",
            attributes: {
              firstName: "John",
            },
          },
        },
      })
      const { body: account } = await fetch("/api/accounts", {
        method: "post",
        body: {
          data: {
            type: "Account",
            attributes: {
              name: "Acme",
            },
            relationships: {
              salesPerson: {
                data: {
                  type: "SalesPerson",
                  id: salesPerson.data.id,
                },
              },
            },
          },
        },
      })
      const { body: accounts } = await fetch(
        "/api/accounts?include=salesPerson",
      )
      expect(accounts).toEqual({
        jsonapi: { version: "1.0" },
        data: [
          {
            type: "Account",
            id: account.data.id,
            attributes: {
              name: "Acme",
              finisherId: salesPerson.data.id,
            },
            relationships: {
              salesPerson: {
                data: {
                  type: "SalesPerson",
                  id: salesPerson.data.id,
                },
              },
            },
          },
        ],
        included: [
          {
            type: "SalesPerson",
            id: salesPerson.data.id,
            attributes: {
              firstName: "John",
            },
          },
        ],

        meta: { unpaginatedCount: 1 },
      })
    })
  })

  describe(`${dialect} - hasMany()`, () => {
    const Account = {
      name: "Account",
      attributes: {
        name: string(),
      },
    } satisfies PartialSchema
    const SalesPerson = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
      relationships: {
        accounts: hasMany(),
      },
    } satisfies PartialSchema

    let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
    let hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"]
    let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

    beforeAll(async () => {
      ;({ fetch, hatchify, teardown } = await startServerWith(
        { SalesPerson, Account },
        dialect,
      ))
    })

    afterAll(async () => {
      await teardown()
    })

    it("creates a column sales_person_id in the account table", async () => {
      const sortedColumns = await getDatabaseColumns(hatchify, "account")

      expect(sortedColumns).toEqual(
        expect.arrayContaining([
          {
            name: "sales_person_id",
            allowNull: true,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
            foreignKeys: [
              {
                ...(dialect === "postgres" ? { schemaName: "public" } : {}),
                tableName: "sales_person",
                columnName: "id",
              },
            ],
          },
        ]),
      )
    })

    it("accounts will be used in the include query parameter, mutation payloads and response payloads", async () => {
      const { body: account } = await fetch("/api/accounts", {
        method: "post",
        body: {
          data: {
            type: "Account",
            attributes: {
              name: "Acme",
            },
          },
        },
      })
      const { body: salesPerson } = await fetch("/api/sales-persons", {
        method: "post",
        body: {
          data: {
            type: "SalesPerson",
            attributes: {
              firstName: "John",
            },
            relationships: {
              accounts: {
                data: [
                  {
                    type: "Account",
                    id: account.data.id,
                  },
                ],
              },
            },
          },
        },
      })
      const { body: salesPersons } = await fetch(
        "/api/sales-persons?include=accounts",
      )
      expect(salesPersons).toEqual({
        jsonapi: { version: "1.0" },
        data: [
          {
            type: "SalesPerson",
            id: salesPerson.data.id,
            attributes: {
              firstName: "John",
            },
            relationships: {
              accounts: {
                data: [
                  {
                    type: "Account",
                    id: account.data.id,
                  },
                ],
              },
            },
          },
        ],
        included: [
          {
            type: "Account",
            id: account.data.id,
            attributes: {
              name: "Acme",
              salesPersonId: salesPerson.data.id,
            },
          },
        ],

        meta: { unpaginatedCount: 1 },
      })
    })
  })

  describe(`${dialect} - hasMany(schemaName)`, () => {
    const Account = {
      name: "Account",
      attributes: {
        name: string(),
      },
    } satisfies PartialSchema
    const SalesPerson = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
      relationships: {
        accounts: hasMany("Account"),
      },
    } satisfies PartialSchema

    let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
    let hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"]
    let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

    beforeAll(async () => {
      ;({ fetch, hatchify, teardown } = await startServerWith(
        { SalesPerson, Account },
        dialect,
      ))
    })

    afterAll(async () => {
      await teardown()
    })

    it("creates a column sales_person_id in the account table", async () => {
      const sortedColumns = await getDatabaseColumns(hatchify, "account")

      expect(sortedColumns).toEqual(
        expect.arrayContaining([
          {
            name: "sales_person_id",
            allowNull: true,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
            foreignKeys: [
              {
                ...(dialect === "postgres" ? { schemaName: "public" } : {}),
                tableName: "sales_person",
                columnName: "id",
              },
            ],
          },
        ]),
      )
    })

    it("accounts will be used in the include query parameter, mutation payloads and response payloads", async () => {
      const { body: account } = await fetch("/api/accounts", {
        method: "post",
        body: {
          data: {
            type: "Account",
            attributes: {
              name: "Acme",
            },
          },
        },
      })
      const { body: salesPerson } = await fetch("/api/sales-persons", {
        method: "post",
        body: {
          data: {
            type: "SalesPerson",
            attributes: {
              firstName: "John",
            },
            relationships: {
              accounts: {
                data: [
                  {
                    type: "Account",
                    id: account.data.id,
                  },
                ],
              },
            },
          },
        },
      })
      const { body: salesPersons } = await fetch(
        "/api/sales-persons?include=accounts",
      )
      expect(salesPersons).toEqual({
        jsonapi: { version: "1.0" },
        data: [
          {
            type: "SalesPerson",
            id: salesPerson.data.id,
            attributes: {
              firstName: "John",
            },
            relationships: {
              accounts: {
                data: [
                  {
                    type: "Account",
                    id: account.data.id,
                  },
                ],
              },
            },
          },
        ],
        included: [
          {
            type: "Account",
            id: account.data.id,
            attributes: {
              name: "Acme",
              salesPersonId: salesPerson.data.id,
            },
          },
        ],

        meta: { unpaginatedCount: 1 },
      })
    })
  })

  describe(`${dialect} - hasMany(schemaName, { targetAttribute })`, () => {
    const Account = {
      name: "Account",
      attributes: {
        name: string(),
      },
    } satisfies PartialSchema
    const SalesPerson = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
      relationships: {
        accounts: hasMany("Account", { targetAttribute: "salesId" }),
      },
    } satisfies PartialSchema

    let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
    let hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"]
    let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

    beforeAll(async () => {
      ;({ fetch, hatchify, teardown } = await startServerWith(
        { SalesPerson, Account },
        dialect,
      ))
    })

    afterAll(async () => {
      await teardown()
    })

    it("creates a column sales_id in the account table", async () => {
      const sortedColumns = await getDatabaseColumns(hatchify, "account")

      expect(sortedColumns).toEqual(
        expect.arrayContaining([
          {
            name: "sales_id",
            allowNull: true,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
            foreignKeys: [
              {
                ...(dialect === "postgres" ? { schemaName: "public" } : {}),
                tableName: "sales_person",
                columnName: "id",
              },
            ],
          },
        ]),
      )
    })

    it("accounts will be used in the include query parameter, mutation payloads and response payloads", async () => {
      const { body: account } = await fetch("/api/accounts", {
        method: "post",
        body: {
          data: {
            type: "Account",
            attributes: {
              name: "Acme",
            },
          },
        },
      })
      const { body: salesPerson } = await fetch("/api/sales-persons", {
        method: "post",
        body: {
          data: {
            type: "SalesPerson",
            attributes: {
              firstName: "John",
            },
            relationships: {
              accounts: {
                data: [
                  {
                    type: "Account",
                    id: account.data.id,
                  },
                ],
              },
            },
          },
        },
      })
      const { body: salesPersons } = await fetch(
        "/api/sales-persons?include=accounts",
      )
      expect(salesPersons).toEqual({
        jsonapi: { version: "1.0" },
        data: [
          {
            type: "SalesPerson",
            id: salesPerson.data.id,
            attributes: {
              firstName: "John",
            },
            relationships: {
              accounts: {
                data: [
                  {
                    type: "Account",
                    id: account.data.id,
                  },
                ],
              },
            },
          },
        ],
        included: [
          {
            type: "Account",
            id: account.data.id,
            attributes: {
              name: "Acme",
              salesId: salesPerson.data.id,
            },
          },
        ],

        meta: { unpaginatedCount: 1 },
      })
    })
  })

  describe(`${dialect} - hasMany().through()`, () => {
    const Account = {
      name: "Account",
      attributes: {
        name: string(),
      },
    } satisfies PartialSchema
    const SalesPerson = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
      relationships: {
        accounts: hasMany().through(),
      },
    } satisfies PartialSchema

    let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
    let hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"]
    let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

    beforeAll(async () => {
      ;({ fetch, hatchify, teardown } = await startServerWith(
        { SalesPerson, Account },
        dialect,
      ))
    })

    afterAll(async () => {
      await teardown()
    })

    it("creates account_sales_person with account_id and sales_person_id", async () => {
      const [account, salesPerson, accountSalesPerson] = await Promise.all([
        getDatabaseColumns(hatchify, "account"),
        getDatabaseColumns(hatchify, "sales_person"),
        getDatabaseColumns(hatchify, "account_sales_person"),
      ])

      expect(account).toEqual(
        expect.arrayContaining([
          {
            name: "id",
            allowNull: false,
            primary: true,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
          },
        ]),
      )

      expect(salesPerson).toEqual(
        expect.arrayContaining([
          {
            name: "id",
            allowNull: false,
            primary: true,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
          },
        ]),
      )

      expect(accountSalesPerson).toEqual(
        expect.arrayContaining([
          {
            name: "account_id",
            allowNull: false,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
            foreignKeys: [
              {
                ...(dialect === "postgres" ? { schemaName: "public" } : {}),
                tableName: "account",
                columnName: "id",
              },
            ],
          },
          {
            name: "id",
            allowNull: false,
            primary: true,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
          },
          {
            name: "sales_person_id",
            allowNull: false,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
            foreignKeys: [
              {
                ...(dialect === "postgres" ? { schemaName: "public" } : {}),
                tableName: "sales_person",
                columnName: "id",
              },
            ],
          },
        ]),
      )
    })

    it("accounts will be used in the include query parameter, mutation payloads and response payloads", async () => {
      const { body: account } = await fetch("/api/accounts", {
        method: "post",
        body: {
          data: {
            type: "Account",
            attributes: {
              name: "Acme",
            },
          },
        },
      })
      const { body: salesPerson } = await fetch("/api/sales-persons", {
        method: "post",
        body: {
          data: {
            type: "SalesPerson",
            attributes: {
              firstName: "John",
            },
            relationships: {
              accounts: {
                data: [
                  {
                    type: "Account",
                    id: account.data.id,
                  },
                ],
              },
            },
          },
        },
      })
      const { body: salesPersons } = await fetch(
        "/api/sales-persons?include=accounts,accountSalesPersons",
      )
      expect(salesPersons).toEqual({
        jsonapi: { version: "1.0" },
        data: [
          {
            type: "SalesPerson",
            id: salesPerson.data.id,
            attributes: {
              firstName: "John",
            },
            relationships: {
              accounts: {
                data: [
                  {
                    type: "Account",
                    id: account.data.id,
                  },
                ],
              },
              accountSalesPersons: {
                data: [
                  {
                    type: "AccountSalesPerson",
                    id: expect.any(String),
                  },
                ],
              },
            },
          },
        ],
        included: [
          {
            type: "Account",
            id: account.data.id,
            attributes: {
              name: "Acme",
            },
          },
          {
            type: "AccountSalesPerson",
            id: expect.any(String),
            attributes: {
              salesPersonId: salesPerson.data.id,
              accountId: account.data.id,
            },
          },
        ],
        meta: { unpaginatedCount: 1 },
      })
    })
  })

  describe(`${dialect} - hasMany(schemaName).through()`, () => {
    const Account = {
      name: "Account",
      attributes: {
        name: string(),
      },
    } satisfies PartialSchema
    const SalesPerson = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
      relationships: {
        accounts: hasMany("Account").through(),
      },
    } satisfies PartialSchema

    let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
    let hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"]
    let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

    beforeAll(async () => {
      ;({ fetch, hatchify, teardown } = await startServerWith(
        { SalesPerson, Account },
        dialect,
      ))
    })

    afterAll(async () => {
      await teardown()
    })

    it("creates account_sales_person with account_id and sales_person_id", async () => {
      const [account, salesPerson, accountSalesPerson] = await Promise.all([
        getDatabaseColumns(hatchify, "account"),
        getDatabaseColumns(hatchify, "sales_person"),
        getDatabaseColumns(hatchify, "account_sales_person"),
      ])

      expect(account).toEqual(
        expect.arrayContaining([
          {
            name: "id",
            allowNull: false,
            primary: true,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
          },
        ]),
      )

      expect(salesPerson).toEqual(
        expect.arrayContaining([
          {
            name: "id",
            allowNull: false,
            primary: true,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
          },
        ]),
      )

      expect(accountSalesPerson).toEqual(
        expect.arrayContaining([
          {
            name: "account_id",
            allowNull: false,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
            foreignKeys: [
              {
                ...(dialect === "postgres" ? { schemaName: "public" } : {}),
                tableName: "account",
                columnName: "id",
              },
            ],
          },
          {
            name: "id",
            allowNull: false,
            primary: true,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
          },
          {
            name: "sales_person_id",
            allowNull: false,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
            foreignKeys: [
              {
                ...(dialect === "postgres" ? { schemaName: "public" } : {}),
                tableName: "sales_person",
                columnName: "id",
              },
            ],
          },
        ]),
      )
    })

    it("accounts will be used in the include query parameter, mutation payloads and response payloads", async () => {
      const { body: account } = await fetch("/api/accounts", {
        method: "post",
        body: {
          data: {
            type: "Account",
            attributes: {
              name: "Acme",
            },
          },
        },
      })
      const { body: salesPerson } = await fetch("/api/sales-persons", {
        method: "post",
        body: {
          data: {
            type: "SalesPerson",
            attributes: {
              firstName: "John",
            },
            relationships: {
              accounts: {
                data: [
                  {
                    type: "Account",
                    id: account.data.id,
                  },
                ],
              },
            },
          },
        },
      })
      const { body: salesPersons } = await fetch(
        "/api/sales-persons?include=accounts,accountSalesPersons",
      )
      expect(salesPersons).toEqual({
        jsonapi: { version: "1.0" },
        data: [
          {
            type: "SalesPerson",
            id: salesPerson.data.id,
            attributes: {
              firstName: "John",
            },
            relationships: {
              accounts: {
                data: [
                  {
                    type: "Account",
                    id: account.data.id,
                  },
                ],
              },
              accountSalesPersons: {
                data: [
                  {
                    type: "AccountSalesPerson",
                    id: expect.any(String),
                  },
                ],
              },
            },
          },
        ],
        included: [
          {
            type: "Account",
            id: account.data.id,
            attributes: {
              name: "Acme",
            },
          },
          {
            type: "AccountSalesPerson",
            id: expect.any(String),
            attributes: {
              salesPersonId: salesPerson.data.id,
              accountId: account.data.id,
            },
          },
        ],

        meta: { unpaginatedCount: 1 },
      })
    })
  })

  describe(`${dialect} - hasMany().through(schemaName)`, () => {
    const Account = {
      name: "Account",
      attributes: {
        name: string(),
      },
    } satisfies PartialSchema
    const SalesPerson = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
      relationships: {
        accounts: hasMany().through("Commission"),
      },
    } satisfies PartialSchema

    let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
    let hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"]
    let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

    beforeAll(async () => {
      ;({ fetch, hatchify, teardown } = await startServerWith(
        { SalesPerson, Account },
        dialect,
      ))
    })

    afterAll(async () => {
      await teardown()
    })

    it("creates account_sales_person with account_id and sales_person_id", async () => {
      const [account, salesPerson, commission] = await Promise.all([
        getDatabaseColumns(hatchify, "account"),
        getDatabaseColumns(hatchify, "sales_person"),
        getDatabaseColumns(hatchify, "commission"),
      ])

      expect(account).toEqual(
        expect.arrayContaining([
          {
            name: "id",
            allowNull: false,
            primary: true,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
          },
        ]),
      )

      expect(salesPerson).toEqual(
        expect.arrayContaining([
          {
            name: "id",
            allowNull: false,
            primary: true,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
          },
        ]),
      )

      expect(commission).toEqual(
        expect.arrayContaining([
          {
            name: "account_id",
            allowNull: false,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
            foreignKeys: [
              {
                ...(dialect === "postgres" ? { schemaName: "public" } : {}),
                tableName: "account",
                columnName: "id",
              },
            ],
          },
          {
            name: "id",
            allowNull: false,
            primary: true,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
          },
          {
            name: "sales_person_id",
            allowNull: false,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
            foreignKeys: [
              {
                ...(dialect === "postgres" ? { schemaName: "public" } : {}),
                tableName: "sales_person",
                columnName: "id",
              },
            ],
          },
        ]),
      )
    })

    it("accounts will be used in the include query parameter, mutation payloads and response payloads", async () => {
      const { body: account } = await fetch("/api/accounts", {
        method: "post",
        body: {
          data: {
            type: "Account",
            attributes: {
              name: "Acme",
            },
          },
        },
      })
      const { body: salesPerson } = await fetch("/api/sales-persons", {
        method: "post",
        body: {
          data: {
            type: "SalesPerson",
            attributes: {
              firstName: "John",
            },
            relationships: {
              accounts: {
                data: [
                  {
                    type: "Account",
                    id: account.data.id,
                  },
                ],
              },
            },
          },
        },
      })
      const { body: salesPersons } = await fetch(
        "/api/sales-persons?include=accounts,commissions",
      )
      expect(salesPersons).toEqual({
        jsonapi: { version: "1.0" },
        data: [
          {
            type: "SalesPerson",
            id: salesPerson.data.id,
            attributes: {
              firstName: "John",
            },
            relationships: {
              accounts: {
                data: [
                  {
                    type: "Account",
                    id: account.data.id,
                  },
                ],
              },
              commissions: {
                data: [
                  {
                    type: "Commission",
                    id: expect.any(String),
                  },
                ],
              },
            },
          },
        ],
        included: [
          {
            type: "Account",
            id: account.data.id,
            attributes: {
              name: "Acme",
            },
          },
          {
            type: "Commission",
            id: expect.any(String),
            attributes: {
              salesPersonId: salesPerson.data.id,
              accountId: account.data.id,
            },
          },
        ],

        meta: { unpaginatedCount: 1 },
      })
    })
  })

  describe(`${dialect} - hasMany().through(existingSchema)`, () => {
    const AccountSalesPerson = {
      name: "AccountSalesPerson",
      attributes: {
        accountId: uuid({ required: true }),
        salesPersonId: uuid({ required: true }),
        score: integer(),
      },
    } satisfies PartialSchema
    const Account = {
      name: "Account",
      attributes: {
        name: string(),
      },
    } satisfies PartialSchema
    const SalesPerson = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
      relationships: {
        accounts: hasMany().through(),
      },
    } satisfies PartialSchema

    let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
    let hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"]
    let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

    beforeAll(async () => {
      ;({ fetch, hatchify, teardown } = await startServerWith(
        { SalesPerson, Account, AccountSalesPerson },
        dialect,
      ))
    })

    afterAll(async () => {
      await teardown()
    })

    it("creates account_sales_person with account_id and sales_person_id", async () => {
      const [account, salesPerson, accountSalesPerson] = await Promise.all([
        getDatabaseColumns(hatchify, "account"),
        getDatabaseColumns(hatchify, "sales_person"),
        getDatabaseColumns(hatchify, "account_sales_person"),
      ])

      expect(account).toEqual(
        expect.arrayContaining([
          {
            name: "id",
            allowNull: false,
            primary: true,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
          },
        ]),
      )

      expect(salesPerson).toEqual(
        expect.arrayContaining([
          {
            name: "id",
            allowNull: false,
            primary: true,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
          },
        ]),
      )

      expect(accountSalesPerson).toEqual(
        expect.arrayContaining([
          {
            name: "account_id",
            allowNull: false,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
            foreignKeys: [
              {
                ...(dialect === "postgres" ? { schemaName: "public" } : {}),
                tableName: "account",
                columnName: "id",
              },
            ],
          },
          {
            name: "id",
            allowNull: false,
            primary: true,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
          },
          {
            name: "sales_person_id",
            allowNull: false,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
            foreignKeys: [
              {
                ...(dialect === "postgres" ? { schemaName: "public" } : {}),
                tableName: "sales_person",
                columnName: "id",
              },
            ],
          },
          {
            name: "score",
            allowNull: true,
            default: null,
            primary: false,
            type: dialect === "postgres" ? "integer" : "INTEGER",
          },
        ]),
      )
    })

    it("accounts will be used in the include query parameter, mutation payloads and response payloads", async () => {
      const { body: account } = await fetch("/api/accounts", {
        method: "post",
        body: {
          data: {
            type: "Account",
            attributes: {
              name: "Acme",
            },
          },
        },
      })
      const { body: salesPerson } = await fetch("/api/sales-persons", {
        method: "post",
        body: {
          data: {
            type: "SalesPerson",
            attributes: {
              firstName: "John",
            },
          },
        },
      })
      const { body: accountSalesPerson } = await fetch(
        "/api/account-sales-persons",
        {
          method: "post",
          body: {
            data: {
              type: "AccountSalesPerson",
              attributes: {
                accountId: account.data.id,
                salesPersonId: salesPerson.data.id,
                score: 90,
              },
            },
          },
        },
      )

      const { body: salesPersons } = await fetch(
        "/api/sales-persons?include=accounts,accountSalesPersons",
      )
      expect(salesPersons).toEqual({
        jsonapi: { version: "1.0" },
        data: [
          {
            type: "SalesPerson",
            id: salesPerson.data.id,
            attributes: {
              firstName: "John",
            },
            relationships: {
              accounts: {
                data: [
                  {
                    type: "Account",
                    id: account.data.id,
                  },
                ],
              },
              accountSalesPersons: {
                data: [
                  {
                    type: "AccountSalesPerson",
                    id: accountSalesPerson.data.id,
                  },
                ],
              },
            },
          },
        ],
        included: [
          {
            type: "Account",
            id: account.data.id,
            attributes: {
              name: "Acme",
            },
          },
          {
            type: "AccountSalesPerson",
            id: accountSalesPerson.data.id,
            attributes: {
              salesPersonId: salesPerson.data.id,
              accountId: account.data.id,
              score: 90,
            },
          },
        ],
        meta: { unpaginatedCount: 1 },
      })
    })
  })

  describe(`${dialect} - hasMany().through(schemaName, { throughTargetAttribute, throughSourceAttribute })`, () => {
    const Account = {
      name: "Account",
      attributes: {
        name: string(),
      },
    } satisfies PartialSchema
    const SalesPerson = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
      relationships: {
        accounts: hasMany().through(null, {
          throughTargetAttribute: "theAccountId",
          throughSourceAttribute: "sellerId",
        }),
      },
    } satisfies PartialSchema

    let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
    let hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"]
    let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

    beforeAll(async () => {
      ;({ fetch, hatchify, teardown } = await startServerWith(
        { SalesPerson, Account },
        dialect,
      ))
    })

    afterAll(async () => {
      await teardown()
    })

    it("creates account_sales_person with account_id and sales_person_id", async () => {
      const [account, salesPerson, accountSalesPerson] = await Promise.all([
        getDatabaseColumns(hatchify, "account"),
        getDatabaseColumns(hatchify, "sales_person"),
        getDatabaseColumns(hatchify, "account_sales_person"),
      ])

      expect(account).toEqual(
        expect.arrayContaining([
          {
            name: "id",
            allowNull: false,
            primary: true,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
          },
        ]),
      )

      expect(salesPerson).toEqual(
        expect.arrayContaining([
          {
            name: "id",
            allowNull: false,
            primary: true,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
          },
        ]),
      )

      expect(accountSalesPerson).toEqual(
        expect.arrayContaining([
          {
            name: "id",
            allowNull: false,
            primary: true,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
          },
          {
            name: "the_account_id",
            allowNull: false,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
            foreignKeys: [
              {
                ...(dialect === "postgres" ? { schemaName: "public" } : {}),
                tableName: "account",
                columnName: "id",
              },
            ],
          },
          {
            name: "seller_id",
            allowNull: false,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
            foreignKeys: [
              {
                ...(dialect === "postgres" ? { schemaName: "public" } : {}),
                tableName: "sales_person",
                columnName: "id",
              },
            ],
          },
        ]),
      )
    })

    it("accounts will be used in the include query parameter, mutation payloads and response payloads", async () => {
      const { body: account } = await fetch("/api/accounts", {
        method: "post",
        body: {
          data: {
            type: "Account",
            attributes: {
              name: "Acme",
            },
          },
        },
      })
      const { body: salesPerson } = await fetch("/api/sales-persons", {
        method: "post",
        body: {
          data: {
            type: "SalesPerson",
            attributes: {
              firstName: "John",
            },
            relationships: {
              accounts: {
                data: [
                  {
                    type: "Account",
                    id: account.data.id,
                  },
                ],
              },
            },
          },
        },
      })
      const { body: salesPersons } = await fetch(
        "/api/sales-persons?include=accounts,accountSalesPersons",
      )
      expect(salesPersons).toEqual({
        jsonapi: { version: "1.0" },
        data: [
          {
            type: "SalesPerson",
            id: salesPerson.data.id,
            attributes: {
              firstName: "John",
            },
            relationships: {
              accounts: {
                data: [
                  {
                    type: "Account",
                    id: account.data.id,
                  },
                ],
              },
              accountSalesPersons: {
                data: [
                  {
                    type: "AccountSalesPerson",
                    id: expect.any(String),
                  },
                ],
              },
            },
          },
        ],
        included: [
          {
            type: "Account",
            id: account.data.id,
            attributes: {
              name: "Acme",
            },
          },
          {
            type: "AccountSalesPerson",
            id: expect.any(String),
            attributes: {
              sellerId: salesPerson.data.id,
              theAccountId: account.data.id,
            },
          },
        ],

        meta: { unpaginatedCount: 1 },
      })
    })
  })

  describe(`${dialect} - hasMany().through(schemaName, { targetKey, sourceKey })`, () => {
    const Account = {
      name: "Account",
      attributes: {
        name: string(),
        accountSaleTypeId: uuid({ unique: true }),
      },
    } satisfies PartialSchema
    const SalesPerson = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
        sellerTypeId: uuid({ unique: true }),
      },
      relationships: {
        accounts: hasMany().through(null, {
          targetKey: "accountSaleTypeId",
          sourceKey: "sellerTypeId",
        }),
      },
    } satisfies PartialSchema

    let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
    let hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"]
    let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

    beforeAll(async () => {
      ;({ fetch, hatchify, teardown } = await startServerWith(
        { SalesPerson, Account },
        dialect,
      ))
    })

    afterAll(async () => {
      await teardown()
    })

    it("creates account_sales_person with account_id and sales_person_id", async () => {
      const [account, salesPerson, accountSalesPerson] = await Promise.all([
        getDatabaseColumns(hatchify, "account"),
        getDatabaseColumns(hatchify, "sales_person"),
        getDatabaseColumns(hatchify, "account_sales_person"),
      ])

      expect(account).toEqual(
        expect.arrayContaining([
          {
            name: "id",
            allowNull: false,
            primary: true,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
          },
        ]),
      )

      expect(salesPerson).toEqual(
        expect.arrayContaining([
          {
            name: "id",
            allowNull: false,
            primary: true,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
          },
        ]),
      )

      expect(accountSalesPerson).toEqual(
        expect.arrayContaining([
          {
            name: "account_id",
            allowNull: false,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
            foreignKeys: [
              {
                ...(dialect === "postgres" ? { schemaName: "public" } : {}),
                tableName: "account",
                columnName: "account_sale_type_id",
              },
            ],
          },
          {
            name: "id",
            allowNull: false,
            primary: true,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
          },
          {
            name: "sales_person_id",
            allowNull: false,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "uuid" : "UUID",
            foreignKeys: [
              {
                ...(dialect === "postgres" ? { schemaName: "public" } : {}),
                tableName: "sales_person",
                columnName: "seller_type_id",
              },
            ],
          },
        ]),
      )
    })

    it("accounts will be used in the include query parameter, mutation payloads and response payloads", async () => {
      const { body: account } = await fetch("/api/accounts", {
        method: "post",
        body: {
          data: {
            type: "Account",
            attributes: {
              name: "Acme",
              accountSaleTypeId: uuidv4(),
            },
          },
        },
      })
      const { body: salesPerson } = await fetch("/api/sales-persons", {
        method: "post",
        body: {
          data: {
            type: "SalesPerson",
            attributes: {
              firstName: "John",
              sellerTypeId: uuidv4(),
            },
            relationships: {
              accounts: {
                data: [
                  {
                    type: "Account",
                    id: account.data.attributes.accountSaleTypeId,
                  },
                ],
              },
            },
          },
        },
      })

      const { body: salesPersons } = await fetch(
        "/api/sales-persons?include=accounts,accountSalesPersons",
      )
      expect(salesPersons).toEqual({
        jsonapi: { version: "1.0" },
        data: [
          {
            type: "SalesPerson",
            id: salesPerson.data.id,
            attributes: {
              sellerTypeId: salesPerson.data.attributes.sellerTypeId,
              firstName: "John",
            },
            relationships: {
              accounts: {
                data: [
                  {
                    type: "Account",
                    id: account.data.id,
                  },
                ],
              },
              accountSalesPersons: {
                data: [
                  {
                    type: "AccountSalesPerson",
                    id: expect.any(String),
                  },
                ],
              },
            },
          },
        ],
        included: [
          {
            type: "Account",
            id: account.data.id,
            attributes: {
              accountSaleTypeId: account.data.attributes.accountSaleTypeId,
              name: "Acme",
            },
          },
          {
            type: "AccountSalesPerson",
            id: expect.any(String),
            attributes: {
              accountId: account.data.attributes.accountSaleTypeId,
              salesPersonId: salesPerson.data.attributes.sellerTypeId,
            },
          },
        ],

        meta: { unpaginatedCount: 1 },
      })
    })
  })
})
