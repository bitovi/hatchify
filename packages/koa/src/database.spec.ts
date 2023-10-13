import { string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/node"

import { startServerWith } from "./testing/utils"

interface Table {
  tableName: string
  columns: string[]
}
interface TestCase {
  description: string
  models: Record<string, PartialSchema>
  database: Table[]
}

describe("Naming rules", () => {
  const databaseNamingTestCases: TestCase[] = [
    {
      description: "Ensure database name and columns are in snake case",
      models: {
        SalesPerson: {
          name: "SalesPerson",
          attributes: {
            name: string(),
            description: string(),
          },
        },
        Account: {
          name: "Account",
          attributes: {
            name: string(),
          },
        },
        StateCommercialRepresentative: {
          name: "StateCommercialRepresentative",
          attributes: {
            name: string(),
            hasActiveContracts: string(),
          },
        },
      },
      database: [
        {
          tableName: "sales_person",
          columns: ["id", "name", "description"],
        },
        {
          tableName: "account",
          columns: ["id", "name"],
        },
        {
          tableName: "state_commercial_representative",
          columns: ["id", "name", "has_active_contracts"],
        },
      ],
    },
  ]
  const cases: TestCase[] = [...databaseNamingTestCases]

  let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]
  let hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"]

  afterAll(async () => {
    await teardown()
  })

  it.each(cases)("$description", async ({ description, models, database }) => {
    ;({ teardown, hatchify } = await startServerWith(models))

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
