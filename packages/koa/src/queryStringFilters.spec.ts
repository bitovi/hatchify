import {
  belongsTo,
  boolean,
  datetime,
  hasMany,
  integer,
  string,
} from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/node"
import * as dotenv from "dotenv"

import { dbDialects, startServerWith } from "./testing/utils.js"

type User = {
  name: string
  age: number
  startDate: string
  onSite: boolean
  manager: boolean
}
const [john, jane]: User[] = [
  {
    name: "John",
    age: 25,
    startDate: "2020-05-05T00:00:00.000Z",
    onSite: true,
    manager: false,
  },
  {
    name: "Jane",
    age: 35,
    startDate: "2021-01-05T00:00:00.000Z",
    onSite: false,
    manager: false,
  },
]
const testCases = [
  // string
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
  // $ilike
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
      "returns correct data using the $ilike operator for end of a string",
    operator: "$ilike",
    queryParam: `filter[name][$ilike]=${encodeURIComponent("%Ne")}`,
    expectedResult: [jane],
    expectedError: undefined,
  },
  {
    description:
      "does not error when attempting to use the $like operator for entirety of a string",
    operator: "$like",
    queryParam: "filter[name][$like]=John",
    expectedResult: [john],
  },
  {
    description:
      "returns correct data using the $ilike operator for entirety of a string (non-case sensitive)",
    operator: "$ilike",
    queryParam: "filter[name][$ilike]=jOhN",
    expectedResult: [john],
    expectedError: undefined,
  },
  {
    description:
      "returns correct data using the $ilike operator on a relationship",
    operator: "$ilike",
    queryParam: `include=userTodos&filter[userTodos.somethingElse][$ilike]=${encodeURIComponent(
      "%Ne",
    )}`,
    expectedResult: [john],
    expectedError: undefined,
  },
  // $like
  {
    description:
      "returns correct data using the $like operator for beginning of a string",
    operator: "$like",
    queryParam: `filter[name][$like]=${encodeURIComponent("Jo%")}`,
    expectedResult: [john],
    expectedError: undefined,
  },
  {
    description:
      "returns correct data using the $like operator for beginning of a string",
    operator: "$like",
    queryParam: `filter[name][$like]=${encodeURIComponent("jO%")}`,
    expectedResult: [],
    expectedError: undefined,
  },
  {
    description:
      "returns correct data using the $like operator for middle of a string",
    operator: "$like",
    queryParam: `filter[name][$like]=${encodeURIComponent("%an%")}`,
    expectedResult: [jane],
    expectedError: undefined,
  },
  {
    description:
      "returns correct data using the $like operator for middle of a string",
    operator: "$like",
    queryParam: `filter[name][$like]=${encodeURIComponent("%aN%")}`,
    expectedResult: [],
    expectedError: undefined,
  },
  {
    description:
      "returns correct data using the $like operator for end of a string",
    operator: "$like",
    queryParam: `filter[name][$like]=${encodeURIComponent("%ne")}`,
    expectedResult: [jane],
    expectedError: undefined,
  },
  {
    description:
      "returns correct data using the $like operator for end of a string",
    operator: "$like",
    queryParam: `filter[name][$like]=${encodeURIComponent("%Ne")}`,
    expectedResult: [],
    expectedError: undefined,
  },
  {
    description:
      "does not error when attempting to use the $like operator for entirety of a string",
    operator: "$like",
    queryParam: "filter[name][$like]=John",
    expectedResult: [john],
  },
  {
    description:
      "returns correct data using the $like operator for entirety of a string (non-case sensitive)",
    operator: "$like",
    queryParam: "filter[name][$like]=jOhN",
    expectedResult: [],
    expectedError: undefined,
  },
  {
    description:
      "returns correct data using the $like operator on a relationship",
    operator: "$like",
    queryParam: `include=userTodos&filter[userTodos.somethingElse][$like]=${encodeURIComponent(
      "%ne",
    )}`,
    expectedResult: [john],
    expectedError: undefined,
  },
  {
    description:
      "returns correct data using the $like operator on a relationship",
    operator: "$like",
    queryParam: `include=userTodos&filter[userTodos.somethingElse][$like]=${encodeURIComponent(
      "%Ne",
    )}`,
    expectedResult: [],
    expectedError: undefined,
  },
  // number
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
  // arrays
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
  // date
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
    queryParam: "filter[startDate][$gt]=2020-12-12T00:00:00.000Z",
    expectedResult: [jane],
  },
  {
    description: "returns correct data using the $lt operator with a date",
    operator: "$lt",
    queryParam: "filter[startDate][$lt]=2020-12-12T00:00:00.000Z",
    expectedResult: [john],
  },
  {
    description: "returns correct data using the $lte operator with a date",
    operator: "$lte",
    queryParam: "filter[startDate][$lte]=2020-05-05T00:00:00.000Z",
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
  {
    description:
      "returns correct data using the $ilike operator for an array of strings (non-case sensitive)",
    operator: "$ilike",
    queryParam: "filter[name][$ilike]=jOhN,jAnE",
    expectedResult: [john, jane],
    expectedError: undefined,
  },
]

dotenv.config({
  path: ".env",
})

describe.each(dbDialects)("queryStringFilters", (dialect) => {
  const UserTodo = {
    name: "UserTodo",
    attributes: {
      name: string(),
      somethingElse: string(),
    },
    relationships: {
      user: belongsTo(),
    },
  } satisfies PartialSchema
  const User = {
    name: "User",
    attributes: {
      name: string(),
      age: integer(),
      startDate: datetime(),
      onSite: boolean(),
      manager: boolean(),
    },
    relationships: {
      userTodos: hasMany(),
    },
  } satisfies PartialSchema

  let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
  let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

  beforeAll(async () => {
    ;({ fetch, teardown } = await startServerWith({ UserTodo, User }, dialect))
    const [{ body: todo1 }, { body: todo2 }] = await Promise.all(
      ["One", "Two"].map((name) =>
        fetch("/api/user-todos", {
          method: "post",
          body: {
            data: {
              type: "UserTodo",
              attributes: {
                name,
                somethingElse: name,
              },
            },
          },
        }),
      ),
    )

    await fetch("/api/users", {
      method: "post",
      body: {
        data: {
          type: "User",
          attributes: john,
          relationships: {
            userTodos: {
              data: [
                {
                  type: "UserTodo",
                  id: todo1.data.id,
                },
              ],
            },
          },
        },
      },
    })

    await fetch("/api/users", {
      method: "post",
      body: {
        data: {
          type: "User",
          attributes: jane,
          relationships: {
            userTodos: {
              data: [
                {
                  type: "UserTodo",
                  id: todo2.data.id,
                },
              ],
            },
          },
        },
      },
    })
  })

  afterAll(async () => {
    const { body } = await fetch(`/api/users/?`)
    const userIds = body.data.map(({ id }: { id: string }) => id)
    await fetch(`/api/users/${userIds[0]}`, {
      method: "delete",
    })
    await fetch(`/api/users/${userIds[1]}`, {
      method: "delete",
    })

    await teardown()
  })

  const validator = async ({
    expectedResult,
    queryParam,
  }: {
    expectedResult: User[]
    queryParam: string
  }) => {
    const { body } = await fetch(`/api/users/?${queryParam}`)
    if (body.errors) {
      throw body.errors
    }
    const users = body.data.map(
      ({ attributes }: { attributes: User }) => attributes,
    )
    expect(users).toEqual(
      expectedResult.map((er) => ({
        ...er,
        startDate: new Date(er.startDate).toISOString(),
      })),
    )
  }

  // eslint-disable-next-line jest/expect-expect
  it.each(testCases)(`${dialect} - $description`, validator)
})
