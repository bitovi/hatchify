import { belongsTo, hasMany, integer, string } from "@hatchifyjs/hatchify-core"
import type { PartialSchema } from "@hatchifyjs/node"

import {
  dbDialects,
  getDatabaseColumns,
  startServerWith,
} from "./testing/utils"

describe.each(dbDialects)("Relationships v2", (dialect) => {
  describe(`${dialect} - belongsTo()`, () => {
    const SalesPerson: PartialSchema = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
    }
    const Account: PartialSchema = {
      name: "Account",
      attributes: {
        name: string(),
      },
      relationships: {
        salesPerson: belongsTo(),
      },
    }

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
            type: dialect === "postgres" ? "integer" : "INTEGER",
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
              salesPersonId: +salesPerson.data.id,
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
    const Account: PartialSchema = {
      name: "Account",
      attributes: {
        name: string(),
      },
      relationships: {
        foob: belongsTo(),
      },
    }

    it("throws for unknown schema", async () => {
      await expect(() => startServerWith({ Account }, dialect)).rejects.toThrow(
        "Schema 'Foob' is undefined",
      )
    })
  })

  describe(`${dialect} - belongsTo(schemaName)`, () => {
    const SalesPerson: PartialSchema = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
    }
    const Account: PartialSchema = {
      name: "Account",
      attributes: {
        name: string(),
      },
      relationships: {
        closerPerson: belongsTo("SalesPerson"),
      },
    }

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
            type: dialect === "postgres" ? "integer" : "INTEGER",
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
              closerPersonId: +closerPerson.data.id,
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
    const SalesPerson: PartialSchema = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
    }
    const Account: PartialSchema = {
      name: "Account",
      attributes: {
        name: string(),
      },
      relationships: {
        salesPerson: belongsTo("SalesPerson", {
          sourceAttribute: "finisherId",
        }),
      },
    }

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
            type: dialect === "postgres" ? "integer" : "INTEGER",
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
              finisherId: +salesPerson.data.id,
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
    const Account: PartialSchema = {
      name: "Account",
      attributes: {
        name: string(),
      },
    }
    const SalesPerson: PartialSchema = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
      relationships: {
        accounts: hasMany(),
      },
    }

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
            type: dialect === "postgres" ? "integer" : "INTEGER",
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
              salesPersonId: +salesPerson.data.id,
            },
          },
        ],

        meta: { unpaginatedCount: 1 },
      })
    })
  })

  describe(`${dialect} - hasMany(schemaName)`, () => {
    const Account: PartialSchema = {
      name: "Account",
      attributes: {
        name: string(),
      },
    }
    const SalesPerson: PartialSchema = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
      relationships: {
        accounts: hasMany("Account"),
      },
    }

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
            type: dialect === "postgres" ? "integer" : "INTEGER",
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
              salesPersonId: +salesPerson.data.id,
            },
          },
        ],

        meta: { unpaginatedCount: 1 },
      })
    })
  })

  describe(`${dialect} - hasMany(schemaName, { targetAttribute })`, () => {
    const Account: PartialSchema = {
      name: "Account",
      attributes: {
        name: string(),
      },
    }
    const SalesPerson: PartialSchema = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
      relationships: {
        accounts: hasMany("Account", { targetAttribute: "salesId" }),
      },
    }

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
            type: dialect === "postgres" ? "integer" : "INTEGER",
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
              salesId: +salesPerson.data.id,
            },
          },
        ],

        meta: { unpaginatedCount: 1 },
      })
    })
  })

  describe(`${dialect} - hasMany().through()`, () => {
    const Account: PartialSchema = {
      name: "Account",
      attributes: {
        name: string(),
      },
    }
    const SalesPerson: PartialSchema = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
      relationships: {
        accounts: hasMany().through(),
      },
    }

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
            allowNull: dialect === "sqlite",
            primary: true,
            default:
              dialect === "postgres"
                ? "nextval('account_id_seq'::regclass)"
                : null,
            type: dialect === "postgres" ? "integer" : "INTEGER",
          },
        ]),
      )

      expect(salesPerson).toEqual(
        expect.arrayContaining([
          {
            name: "id",
            allowNull: dialect === "sqlite",
            primary: true,
            default:
              dialect === "postgres"
                ? "nextval('sales_person_id_seq'::regclass)"
                : null,
            type: dialect === "postgres" ? "integer" : "INTEGER",
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
            type: dialect === "postgres" ? "integer" : "INTEGER",
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
            allowNull: dialect === "sqlite",
            primary: true,
            default:
              dialect === "postgres"
                ? "nextval('account_sales_person_id_seq'::regclass)"
                : null,
            type: dialect === "postgres" ? "integer" : "INTEGER",
          },
          {
            name: "sales_person_id",
            allowNull: false,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "integer" : "INTEGER",
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
                    id: "1",
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
            id: "1",
            attributes: {
              salesPersonId: +salesPerson.data.id,
              accountId: +account.data.id,
            },
          },
        ],
        meta: { unpaginatedCount: 1 },
      })
    })
  })

  describe(`${dialect} - hasMany(schemaName).through()`, () => {
    const Account: PartialSchema = {
      name: "Account",
      attributes: {
        name: string(),
      },
    }
    const SalesPerson: PartialSchema = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
      relationships: {
        accounts: hasMany("Account").through(),
      },
    }

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
            allowNull: dialect === "sqlite",
            primary: true,
            default:
              dialect === "postgres"
                ? "nextval('account_id_seq'::regclass)"
                : null,
            type: dialect === "postgres" ? "integer" : "INTEGER",
          },
        ]),
      )

      expect(salesPerson).toEqual(
        expect.arrayContaining([
          {
            name: "id",
            allowNull: dialect === "sqlite",
            primary: true,
            default:
              dialect === "postgres"
                ? "nextval('sales_person_id_seq'::regclass)"
                : null,
            type: dialect === "postgres" ? "integer" : "INTEGER",
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
            type: dialect === "postgres" ? "integer" : "INTEGER",
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
            allowNull: dialect === "sqlite",
            primary: true,
            default:
              dialect === "postgres"
                ? "nextval('account_sales_person_id_seq'::regclass)"
                : null,
            type: dialect === "postgres" ? "integer" : "INTEGER",
          },
          {
            name: "sales_person_id",
            allowNull: false,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "integer" : "INTEGER",
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
                    id: "1",
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
            id: "1",
            attributes: {
              salesPersonId: +salesPerson.data.id,
              accountId: +account.data.id,
            },
          },
        ],

        meta: { unpaginatedCount: 1 },
      })
    })
  })

  describe(`${dialect} - hasMany().through(schemaName)`, () => {
    const Account: PartialSchema = {
      name: "Account",
      attributes: {
        name: string(),
      },
    }
    const SalesPerson: PartialSchema = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
      relationships: {
        accounts: hasMany().through("Commission"),
      },
    }

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
            allowNull: dialect === "sqlite",
            primary: true,
            default:
              dialect === "postgres"
                ? "nextval('account_id_seq'::regclass)"
                : null,
            type: dialect === "postgres" ? "integer" : "INTEGER",
          },
        ]),
      )

      expect(salesPerson).toEqual(
        expect.arrayContaining([
          {
            name: "id",
            allowNull: dialect === "sqlite",
            primary: true,
            default:
              dialect === "postgres"
                ? "nextval('sales_person_id_seq'::regclass)"
                : null,
            type: dialect === "postgres" ? "integer" : "INTEGER",
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
            type: dialect === "postgres" ? "integer" : "INTEGER",
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
            allowNull: dialect === "sqlite",
            primary: true,
            default:
              dialect === "postgres"
                ? "nextval('commission_id_seq'::regclass)"
                : null,
            type: dialect === "postgres" ? "integer" : "INTEGER",
          },
          {
            name: "sales_person_id",
            allowNull: false,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "integer" : "INTEGER",
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
                    id: "1",
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
            id: "1",
            attributes: {
              salesPersonId: +salesPerson.data.id,
              accountId: +account.data.id,
            },
          },
        ],

        meta: { unpaginatedCount: 1 },
      })
    })
  })

  describe(`${dialect} - hasMany().through({ throughTargetAttribute, throughSourceAttribute })`, () => {
    const Account: PartialSchema = {
      name: "Account",
      attributes: {
        name: string(),
      },
    }
    const SalesPerson: PartialSchema = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
      relationships: {
        accounts: hasMany().through({
          throughTargetAttribute: "theAccountId",
          throughSourceAttribute: "sellerId",
        }),
      },
    }

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
            allowNull: dialect === "sqlite",
            primary: true,
            default:
              dialect === "postgres"
                ? "nextval('account_id_seq'::regclass)"
                : null,
            type: dialect === "postgres" ? "integer" : "INTEGER",
          },
        ]),
      )

      expect(salesPerson).toEqual(
        expect.arrayContaining([
          {
            name: "id",
            allowNull: dialect === "sqlite",
            primary: true,
            default:
              dialect === "postgres"
                ? "nextval('sales_person_id_seq'::regclass)"
                : null,
            type: dialect === "postgres" ? "integer" : "INTEGER",
          },
        ]),
      )

      expect(accountSalesPerson).toEqual(
        expect.arrayContaining([
          {
            name: "id",
            allowNull: dialect === "sqlite",
            primary: true,
            default:
              dialect === "postgres"
                ? "nextval('account_sales_person_id_seq'::regclass)"
                : null,
            type: dialect === "postgres" ? "integer" : "INTEGER",
          },
          {
            name: "the_account_id",
            allowNull: false,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "integer" : "INTEGER",
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
            type: dialect === "postgres" ? "integer" : "INTEGER",
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
                    id: "1",
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
            id: "1",
            attributes: {
              sellerId: +salesPerson.data.id,
              theAccountId: +account.data.id,
            },
          },
        ],

        meta: { unpaginatedCount: 1 },
      })
    })
  })

  describe(`${dialect} - hasMany().through({ targetKey, sourceKey })`, () => {
    const Account: PartialSchema = {
      name: "Account",
      attributes: {
        name: string(),
        accountSaleTypeId: integer(),
      },
    }
    const SalesPerson: PartialSchema = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
        sellerTypeId: integer(),
      },
      relationships: {
        accounts: hasMany().through({
          targetKey: "accountSaleTypeId",
          sourceKey: "sellerTypeId",
        }),
      },
    }

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
            allowNull: dialect === "sqlite",
            primary: true,
            default:
              dialect === "postgres"
                ? "nextval('account_id_seq'::regclass)"
                : null,
            type: dialect === "postgres" ? "integer" : "INTEGER",
          },
        ]),
      )

      expect(salesPerson).toEqual(
        expect.arrayContaining([
          {
            name: "id",
            allowNull: dialect === "sqlite",
            primary: true,
            default:
              dialect === "postgres"
                ? "nextval('sales_person_id_seq'::regclass)"
                : null,
            type: dialect === "postgres" ? "integer" : "INTEGER",
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
            type: dialect === "postgres" ? "integer" : "INTEGER",
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
            allowNull: dialect === "sqlite",
            primary: true,
            default:
              dialect === "postgres"
                ? "nextval('account_sales_person_id_seq'::regclass)"
                : null,
            type: dialect === "postgres" ? "integer" : "INTEGER",
          },
          {
            name: "sales_person_id",
            allowNull: false,
            primary: false,
            default: null,
            type: dialect === "postgres" ? "integer" : "INTEGER",
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
              accountSaleTypeId: 1,
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
              sellerTypeId: 1,
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
              sellerTypeId: 1,
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
                    id: "1",
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
              accountSaleTypeId: 1,
              name: "Acme",
            },
          },
          {
            type: "AccountSalesPerson",
            id: "1",
            attributes: {
              salesPersonId: +salesPerson.data.id,
              accountId: +account.data.id,
            },
          },
        ],

        meta: { unpaginatedCount: 1 },
      })
    })
  })
})
