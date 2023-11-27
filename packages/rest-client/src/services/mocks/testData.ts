import {
  assembler,
  belongsTo,
  boolean,
  hasMany,
  hasOne,
  string,
} from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"
import type { Resource, RestClient } from "../types"

export const testPartialSchemas = {
  Todo: {
    name: "Todo",
    attributes: { title: string(), important: boolean() },
    relationships: { user: belongsTo("Person") },
  },
  Person: {
    name: "Person",
    attributes: { name: string() },
    relationships: {
      todos: hasMany("Todo"),
      employer: belongsTo("Company"),
    },
  },
  Company: {
    name: "Company",
    attributes: { name: string() },
    relationships: {
      employees: hasMany("Person"),
      parentCompany: belongsTo("Company"),
      childCompany: hasOne("Company"),
    },
  },
} satisfies globalThis.Record<string, PartialSchema>

export const testFinalSchemas = assembler(testPartialSchemas)

export const testSchemaMap = {
  Todo: { type: "Todo", endpoint: "todos" },
  Person: { type: "Person", endpoint: "persons" },
  Company: { type: "Company", endpoint: "companys" },
}

export const testDataRecords: Resource[] = [
  {
    id: "todo-1",
    __schema: "Todo",
    attributes: { title: "Code Review", important: true },
    relationships: { user: { id: "person-1", __schema: "Person" } },
  },
  {
    id: "todo-2",
    __schema: "Todo",
    attributes: { title: "Refactor", important: false },
    relationships: { user: { id: "person-1", __schema: "Person" } },
  },
]

export const testDataRelatedRecords: Resource[] = [
  {
    id: "person-1",
    __schema: "Person",
    attributes: { name: "John" },
    relationships: {
      employer: { id: "company-1", __schema: "Company" },
    },
  },
  {
    id: "company-1",
    __schema: "Company",
    attributes: { name: "Alphabet" },
    relationships: {
      parentCompany: { id: "company-2", __schema: "Company" },
    },
  },
  {
    id: "company-2",
    __schema: "Company",
    attributes: { name: "Alphabet" },
  },
]

export const testMeta = {
  unpaginatedCount: 2,
}

export const fakeDataSource: RestClient<any, any> = {
  version: 0,
  completeSchemaMap: {},
  findAll: () =>
    Promise.resolve([
      { records: testDataRecords, related: testDataRelatedRecords },
      testMeta,
    ]),
  findOne: () =>
    Promise.resolve({
      record: testDataRecords[0],
      related: testDataRelatedRecords,
    }),
  createOne: () =>
    Promise.resolve({
      record: testDataRecords[0],
      related: [],
    }),
  updateOne: () =>
    Promise.resolve({
      record: {
        ...testDataRecords[0],
        attributes: { ...testDataRecords[0].attributes, title: "foo" },
      },
      related: [],
    }),
  deleteOne: () => Promise.resolve(),
}
