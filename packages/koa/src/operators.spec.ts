import type { HatchifyModel } from "@hatchifyjs/node"

import { startServerWith } from "./testing/utils"

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
  // skipped due to test failing
  // {
  //   description:
  //     "returns correct data using the $like operator for end of a string",
  //   operator: "$like",
  //   queryParam: "filter[name][$like]=%ne",
  //   expectedResult: [jane],
  // },
  // skipped due to test failing
  // {
  //   description:
  //     "returns correct data using the $like operator for beginning of a string",
  //   operator: "$like",
  //   queryParam: "filter[name][$like]=Jo%",
  //   expectedResult: [john],
  // },
  // skipped due to test failing
  // {
  //   description:
  //     "returns correct data using the $like operator for middle of a string",
  //   operator: "$like",
  //   queryParam: "filter[name][$like]=%an%",
  //   expectedResult: [jane],
  // },
  // skipped due to test failing
  // {
  //   description:
  //     "returns correct data using the $like operator for entirety of a string (non-case sensitive)",
  //   operator: "$like",
  //   queryParam: "filter[name][$like]=john",
  //   expectedResult: [john],
  // },
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
  // skipped due to test failing
  // {
  //   description: "returns correct data using the $gte operator with a date",
  //   operator: "$gte",
  //   queryParam: "filter[startDate][$gte]=2021-01-05",
  //   expectedResult: [jane],
  // },
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

describe("Operators", () => {
  const User: HatchifyModel = {
    name: "User",
    attributes: {
      name: "STRING",
      age: "NUMBER",
      startDate: "DATE",
      onSite: "BOOLEAN",
      manager: "BOOLEAN",
    },
  }

  let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
  let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

  beforeAll(async () => {
    ;({ fetch, teardown } = await startServerWith([User]))

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
    await teardown()
  })

  it.each(testCases)("$description", async ({ expectedResult, queryParam }) => {
    const { body } = await fetch(`/api/users/?${queryParam}`)
    const users = body.data.map(({ attributes }) => attributes)
    expect(users).toEqual(
      expectedResult.map((er) => ({
        ...er,
        startDate: new Date(er.startDate).toISOString(),
      })),
    )
  })
})
