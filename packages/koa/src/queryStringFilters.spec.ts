import type { HatchifyModel } from "@hatchifyjs/node"
import * as dotenv from "dotenv"

import { startServerWith } from "./testing/utils"
import { dbDialects } from "./testing/utils"

const userData = [
  {
    name: "John",
    age: 25,
    startDate: "2020-05-05",
    onSite: true,
    manager: false,
  },
  {
    name: "Jane",
    age: 35,
    startDate: "2021-01-05",
    onSite: false,
    manager: false,
  },
]
const john = userData[0]
const jane = userData[1]

const testCases = [
  //string
  {
    description: "returns correct data using the $eq operator with a string",
    operator: "$eq",
    queryParam: "filter[name][$eq]=John",
    expectedResult: [john],
  },
  {
    description: "returns correct data using the $ne operator with a string",
    operator: "$ne",
    queryParam: "filter[name][$ne]=John",
    expectedResult: [jane],
  },
  {
    description: "returns correct data using the $gt operator with a string",
    operator: "$gt",
    queryParam: "filter[name][$gt]=Jane",
    expectedResult: [john],
  },
  {
    description: "returns correct data using the $gte operator with a string",
    operator: "$gte",
    queryParam: "filter[name][$gte]=Jane",
    expectedResult: [john, jane],
  },
  {
    description: "returns correct data using the $lt operator with a string",
    operator: "$lt",
    queryParam: "filter[name][$lt]=John",
    expectedResult: [jane],
  },
  {
    description: "returns correct data using the $lte operator with a string",
    operator: "$lte",
    queryParam: "filter[name][$lte]=John",
    expectedResult: [john, jane],
  },
  {
    description: "returns correct data using the $in operator with a string",
    operator: "$in",
    queryParam: "filter[name][$in]=John&filter[name][$in]=Jane",
    expectedResult: [john, jane],
  },
  {
    description: "returns correct data using the $nin operator with a string",
    operator: "$nin",
    queryParam: "filter[name][$nin]=John&filter[name][$nin]=Jane",
    expectedResult: [],
  },
  {
    description:
      "returns correct data using the $ilike operator for end of a string",
    operator: "$ilike",
    queryParam: `filter[name][$ilike]=${encodeURIComponent("%Ne")}`,
    expectedResult: [jane],
    expectedError: undefined,
  },
  {
    description:
      "returns correct data using the $ilike operator for beginning of a string",
    operator: "$ilike",
    queryParam: `filter[name][$ilike]=${encodeURIComponent("jO%")}`,
    expectedResult: [john],
    expectedError: undefined,
  },
  {
    description:
      "returns correct data using the $ilike operator for middle of a string",
    operator: "$ilike",
    queryParam: `filter[name][$ilike]=${encodeURIComponent("%aN%")}`,
    expectedResult: [jane],
    expectedError: undefined,
  },
  {
    description:
      "returns correct data using the $ilike operator for entirety of a string (non-case sensitive)",
    operator: "$ilike",
    queryParam: "filter[name][$ilike]=jOhN",
    expectedResult: [john],
    expectedError: undefined,
  },
  //number
  {
    description: "returns correct data using the $eq operator with a number",
    operator: "$eq",
    queryParam: "filter[age][$eq]=35",
    expectedResult: [jane],
  },
  {
    description: "returns correct data using the $ne operator with a number",
    operator: "$ne",
    queryParam: "filter[age][$ne]=35",
    expectedResult: [john],
  },
  {
    description: "returns correct data using the $gt operator with a number",
    operator: "$gt",
    queryParam: "filter[age][$gt]=30",
    expectedResult: [jane],
  },
  {
    description: "returns correct data using the $lt operator with a number",
    operator: "$lt",
    queryParam: "filter[age][$lt]=30",
    expectedResult: [john],
  },
  {
    description: "returns correct data using the $lte operator with a number",
    operator: "$lte",
    queryParam: "filter[age][$lte]=25",
    expectedResult: [john],
  },
  {
    description: "returns correct data using the $gte operator with a number",
    operator: "$gte",
    queryParam: "filter[age][$gte]=35",
    expectedResult: [jane],
  },
  {
    description: "returns correct data using the $in operator with a number",
    operator: "$in",
    queryParam: "filter[age][$in]=25&filter[age][$in]=35",
    expectedResult: [john, jane],
  },
  {
    description: "returns correct data using the $nin operator with a number",
    operator: "$nin",
    queryParam: "filter[age][$nin]=25&filter[age][$nin]=35",
    expectedResult: [],
  },
  //arrays
  {
    description:
      "returns correct data using the $in operator with multiple strings",
    operator: "$in",
    queryParam: "filter[name][$in]=John&filter[name][$in]=Jane",
    expectedResult: [john, jane],
  },
  {
    description:
      "returns correct data using the $nin operator with multiple strings",
    operator: "$nin",
    queryParam: "filter[name][$nin]=John&filter[name][$nin]=Jane",
    expectedResult: [],
  },
  //date
  {
    description: "returns correct data using the $eq operator with a date",
    operator: "$eq",
    queryParam: "filter[startDate][$eq]=2020-05-05T00:00:00.000Z",
    expectedResult: [john],
  },
  {
    description: "returns correct data using the $ne operator with a date",
    operator: "$ne",
    queryParam: "filter[startDate][$ne]=2020-05-05T00:00:00.000Z",
    expectedResult: [jane],
  },
  {
    description: "returns correct data using the $gt operator with a date",
    operator: "$gt",
    queryParam: "filter[startDate][$gt]=2020-12-12",
    expectedResult: [jane],
  },
  {
    description: "returns correct data using the $lt operator with a date",
    operator: "$lt",
    queryParam: "filter[startDate][$lt]=2020-12-12",
    expectedResult: [john],
  },
  {
    description: "returns correct data using the $lte operator with a date",
    operator: "$lte",
    queryParam: "filter[startDate][$lte]=2020-05-05",
    expectedResult: [john],
  },
  {
    description: "returns correct data using the $gte operator with a date",
    operator: "$gte",
    queryParam: "filter[startDate][$gte]=2021-01-05T00:00:00.000Z",
    expectedResult: [jane],
  },
  {
    description: "returns correct data using the $in operator with a date",
    operator: "$in",
    queryParam:
      "filter[startDate][$in]=2020-05-05T00:00:00.000Z&filter[startDate][$in]=2021-01-05T00:00:00.000Z",
    expectedResult: [john, jane],
  },
  {
    description: "returns correct data using the $nin operator with a date",
    operator: "$nin",
    queryParam:
      "filter[startDate][$nin]=2020-05-05T00:00:00.000Z&filter[startDate][$nin]=2021-01-05T00:00:00.000Z",
    expectedResult: [],
  },
  //boolean
  {
    description: "returns correct data using the $eq operator with a boolean",
    operator: "$eq",
    queryParam: "filter[onSite][$eq]=true",
    expectedResult: [john],
  },
  {
    description: "returns correct data using the $in operator with a boolean",
    operator: "$in",
    queryParam: "filter[onSite][$in]=true&filter[manager][$in]=false",
    expectedResult: [john],
  },
  {
    description: "returns correct data using the $nin operator with a boolean",
    operator: "$nin",
    queryParam: "filter[onSite][$nin]=true&filter[manager][$nin]=true",
    expectedResult: [jane],
  },
]

const postgresOnlyTestCases = [
  // TODO - we need to support this in SQLite too as part of HATCH-329
  {
    description:
      "returns correct data using the $ilike operator for an array of strings (non-case sensitive)",
    operator: "$ilike",
    queryParam: "filter[name][$ilike]=jOhN,jAnE",
    expectedResult: [john, jane],
    expectedError: undefined,
  },
]

// like not supported by SQLite
const SQLiteOnlyTestCases = [
  {
    description:
      "throws error when attempting to use the $like operator for end of a string",
    operator: "$like",
    queryParam: `filter[name][$like]=${encodeURIComponent("%ne")}`,
    expectedErrorSource: {
      parameter: `filter[name][$like]=${encodeURIComponent("%ne")}`,
    },
  },
  {
    description:
      "throws error when attempting to use the $like operator for beginning of a string",
    operator: "$like",
    queryParam: `filter[name][$like]=${encodeURIComponent("Jo%")}`,
    expectedErrorSource: {
      parameter: `filter[name][$like]=${encodeURIComponent("Jo%")}`,
    },
  },
  {
    description:
      "throws error when attempting to use the $like operator for middle of a string",
    operator: "$like",
    queryParam: `filter[name][$like]=${encodeURIComponent("%an%")}`,
    expectedErrorSource: {
      parameter: `filter[name][$like]=${encodeURIComponent("%an%")}`,
    },
  },
  {
    description:
      "throws error when attempting to use the $like operator for entirety of a string (non-case sensitive)",
    operator: "$like",
    queryParam: "filter[name][$like]=John",
    expectedErrorSource: { parameter: "filter[name][$like]=John" },
  },
]

dotenv.config({
  path: ".env",
})

describe.each(dbDialects)("Operators", (dialect) => {
  const User: HatchifyModel = {
    name: "User",
    attributes: {
      name: "STRING",
      age: "INTEGER",
      startDate: "DATE",
      onSite: "BOOLEAN",
      manager: "BOOLEAN",
    },
  }

  let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
  let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

  beforeAll(async () => {
    ;({ fetch, teardown } = await startServerWith([User], dialect))
    await fetch("/api/users", {
      method: "post",
      body: {
        data: {
          type: "User",
          attributes: userData[0],
        },
      },
    })

    await fetch("/api/users", {
      method: "post",
      body: {
        data: {
          type: "User",
          attributes: userData[1],
        },
      },
    })
  })

  afterAll(async () => {
    const { body } = await fetch(`/api/users/?`)
    const userIds = body.data.map(({ id }) => id)
    await fetch(`/api/users/${userIds[0]}`, {
      method: "delete",
    })
    await fetch(`/api/users/${userIds[1]}`, {
      method: "delete",
    })

    await teardown()
  })

  it.each(testCases)(
    `${dialect} - $description`,
    async ({ expectedResult, queryParam }) => {
      const { body } = await fetch(`/api/users/?${queryParam}`)
      const users = body.data.map(({ attributes }) => attributes)
      expect(users).toEqual(
        expectedResult.map((er) => ({
          ...er,
          startDate: new Date(er.startDate).toISOString(),
        })),
      )
    },
  )

  if (dialect === "postgres") {
    it.each(postgresOnlyTestCases)(
      `${dialect} - $description`,
      async ({ expectedResult, queryParam }) => {
        const { body } = await fetch(`/api/users/?${queryParam}`)
        const users = body.data.map(({ attributes }) => attributes)
        expect(users).toEqual(
          expectedResult.map((er) => ({
            ...er,
            startDate: new Date(er.startDate).toISOString(),
          })),
        )
      },
    )
  }

  if (dialect === "sqlite") {
    it.each(SQLiteOnlyTestCases)(
      `${dialect} - $description`,
      async ({ expectedErrorSource, queryParam }) => {
        const result = await fetch(`/api/users/?${queryParam}`)
        const error = JSON.parse(result.error.text)
        expect(error.errors[0]).toEqual({
          status: 422,
          code: "invalid-parameter",
          detail: "SQLITE does not support like. Please use ilike",
          source: expectedErrorSource,
          title: "SQLITE does not support like",
        })
      },
    )
  }
})
