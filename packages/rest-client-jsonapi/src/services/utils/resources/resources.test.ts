import { describe, expect, it } from "vitest"
import type {
  JsonApiResource,
  JsonApiResourceRelationship,
} from "../../jsonapi"
import {
  jsonApiResourceToHatchifyResource,
  convertToHatchifyResources,
  getTypeToSchema,
  convertToJsonApiRelationships,
} from "./resources"
import type { ResourceRelationship, Schema } from "@hatchifyjs/rest-client"

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

describe("hatchifyRelationshipsToJsonApiRelationship", () => {
  it("Correctly converts relationship objects with one or many relationships, including relationships to schemas with custom `type`s", () => {
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
        Article: { type: "article", endpoint: "articles" },
        Person: { endpoint: "people" },
        Tag: { type: "tag", endpoint: "tags" },
      },
    }

    const relationships: Record<
      string,
      | Omit<ResourceRelationship, "__schema">
      | Array<Omit<ResourceRelationship, "__schema">>
    > = {
      person: { id: "1" },
      tag: [{ id: "1" }, { id: "2" }],
    }

    const expected: Record<string, JsonApiResourceRelationship> = {
      person: { data: { id: "1", type: "Person" } },
      tag: {
        data: [
          { id: "1", type: "tag" },
          { id: "2", type: "tag" },
        ],
      },
    }

    expect(
      convertToJsonApiRelationships(sourceConfig, schema, relationships),
    ).toEqual(expected)
  })
})
