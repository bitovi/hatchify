import { describe, expect, it } from "vitest"
import type {
  JsonApiResource,
  JsonApiResourceRelationship,
} from "../../jsonapi"
import {
  convertToHatchifyResources,
  convertToJsonApiRelationships,
  getTypeToSchema,
  jsonApiResourceToHatchifyResource,
} from "./resources"
import type {
  Schema,
  SchemalessResourceRelationshipObject,
} from "@hatchifyjs/rest-client"

describe("rest-client-jsonapi/services/utils/resources", () => {
  const typeToSchema = { article: "Article", person: "Person", tag: "Tag" }
  const schemaMap = {
    Article: { type: "article", endpoint: "articles" },
    Person: { type: "person", endpoint: "people" },
    Tag: { type: "tag", endpoint: "tags" },
  }

  describe("getTypeToSchema", () => {
    it("works", () => {
      expect(getTypeToSchema(schemaMap)).toEqual(typeToSchema)
    })
  })

  describe("jsonApiResourceToHatchifyResource", () => {
    it("works", () => {
      const resource = {
        id: "1",
        type: "article",
        attributes: { title: "foo", body: "foo-body" },
        relationships: {
          author: { data: { id: "1", type: "person" } },
          tags: {
            data: [
              { id: "1", type: "tag" },
              { id: "2", type: "tag" },
            ],
          },
        },
      }

      const expected = {
        id: "1",
        __schema: "Article",
        attributes: {
          title: "foo",
          body: "foo-body",
        },
        relationships: {
          author: { id: "1", __schema: "Person" },
          tags: [
            { id: "1", __schema: "Tag" },
            { id: "2", __schema: "Tag" },
          ],
        },
      }

      expect(jsonApiResourceToHatchifyResource(resource, typeToSchema)).toEqual(
        expected,
      )
    })
  })

  describe("convertToHatchifyResources", () => {
    it("works", () => {
      const resources: JsonApiResource[] = [
        {
          id: "1",
          type: "article",
          attributes: {
            title: "foo",
            body: "foo-body",
          },
          relationships: {
            author: { data: { id: "1", type: "person" } },
            tags: {
              data: [
                { id: "1", type: "tag" },
                { id: "2", type: "tag" },
              ],
            },
          },
        },
        {
          id: "2",
          type: "article",
          attributes: {
            title: "foo",
            body: "foo-body",
          },
          relationships: {
            author: { data: { id: "1", type: "person" } },
            tags: {
              data: [{ id: "1", type: "tag" }],
            },
          },
        },
        {
          id: "1",
          type: "person",
          attributes: { name: "foo" },
        },
        {
          id: "1",
          type: "tag",
          attributes: { title: "tag-2" },
        },
        {
          id: "2",
          type: "tag",
          attributes: { title: "tag-2" },
        },
      ]

      const expected = [
        {
          id: "1",
          __schema: "Article",
          attributes: {
            title: "foo",
            body: "foo-body",
          },
          relationships: {
            author: { id: "1", __schema: "Person" },
            tags: [
              { id: "1", __schema: "Tag" },
              { id: "2", __schema: "Tag" },
            ],
          },
        },
        {
          id: "2",
          __schema: "Article",
          attributes: {
            title: "foo",
            body: "foo-body",
          },
          relationships: {
            author: { id: "1", __schema: "Person" },
            tags: [{ id: "1", __schema: "Tag" }],
          },
        },
        {
          id: "1",
          __schema: "Person",
          attributes: { name: "foo" },
        },
        {
          id: "1",
          __schema: "Tag",
          attributes: { title: "tag-2" },
        },
        {
          id: "2",
          __schema: "Tag",
          attributes: { title: "tag-2" },
        },
      ]

      expect(convertToHatchifyResources(resources, schemaMap)).toEqual(expected)
    })
  })
})

describe("convertToJsonApiRelationships", () => {
  it("Correctly converts relationship objects with one or many relationships", () => {
    const schema: Schema = {
      name: "Article",
      displayAttribute: "name",
      attributes: {
        title: "string",
        body: "string",
      },
      relationships: {
        person: {
          type: "one",
          schema: "Person",
        },
        tag: {
          type: "many",
          schema: "Tag",
        },
      },
    }
    const sourceConfig = {
      baseUrl: "http://localhost:3000/api",
      schemaMap: {
        Article: { type: "Article", endpoint: "articles" },
        Person: { type: "Person", endpoint: "people" },
        Tag: { type: "Tag", endpoint: "tags" },
      },
    }

    const relationships: SchemalessResourceRelationshipObject = {
      person: { id: "1" },
      tag: [{ id: "1" }, { id: "2" }],
    }

    const expected: Record<string, JsonApiResourceRelationship> = {
      person: { data: { id: "1", type: "Person" } },
      tag: {
        data: [
          { id: "1", type: "Tag" },
          { id: "2", type: "Tag" },
        ],
      },
    }

    expect(
      convertToJsonApiRelationships(sourceConfig, schema, relationships),
    ).toEqual(expected)
  })

  it("Correctly converts relationship objects for schemas with custom-defined `type` values", () => {
    const schema: Schema = {
      name: "Article",
      displayAttribute: "name",
      attributes: {
        title: "string",
        body: "string",
      },
      relationships: {
        person: {
          type: "one",
          schema: "Person",
        },
      },
    }
    const sourceConfig = {
      baseUrl: "http://localhost:3000/api",
      schemaMap: {
        Article: { type: "article", endpoint: "articles" },
        Person: { type: "person_custom", endpoint: "people" },
      },
    }

    const relationships: SchemalessResourceRelationshipObject = {
      person: { id: "1" },
    }

    const expected: Record<string, JsonApiResourceRelationship> = {
      person: { data: { id: "1", type: "person_custom" } },
    }

    expect(
      convertToJsonApiRelationships(sourceConfig, schema, relationships),
    ).toEqual(expected)
  })
})
