import { describe, expect, it } from "vitest"
import type { JsonApiResource } from "../../jsonapi"
import {
  convertToHatchifyResources,
  getTypeToSchema,
  jsonApiResourceToHatchifyResource,
} from "./resources"

describe("rest-client-jsonapi/services/utils/resources", () => {
  const typeToSchema = { article: "Article", person: "Person", tag: "Tag" }
  const schemaMap = {
    Article: {
      name: "Article",
      attributes: {},
      type: "article",
      endpoint: "articles",
    },
    Person: {
      name: "Person",
      attributes: {},
      type: "person",
      endpoint: "people",
    },
    Tag: { name: "Tag", attributes: {}, type: "tag", endpoint: "tags" },
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

// todo: v2 relationships
// describe("convertToJsonApiRelationships", () => {
//   it("Correctly converts relationship objects with one or many relationships", () => {
//     const schemaMap = {
//       Article: {
//         name: "Article",
//         displayAttribute: "name",
//         type: "Article",
//         attributes: {
//           title: string(),
//           body: string(),
//         },
//         // relationships: {
//         //   person: {
//         //     type: "one",
//         //     schema: "Person",
//         //   },
//         //   tag: {
//         //     type: "many",
//         //     schema: "Tag",
//         //   },
//         // },
//       },
//       Person: { name: "Person", type: "Person", attributes: {} },
//       Tag: { name: "Tag", type: "Tag", attributes: {} },
//     }
//     const sourceConfig = { baseUrl: "http://localhost:3000/api", schemaMap }

//     const relationships: SchemalessResourceRelationshipObject = {
//       person: { id: "1" },
//       tag: [{ id: "1" }, { id: "2" }],
//     }

//     const expected: Record<string, JsonApiResourceRelationship> = {
//       person: { data: { id: "1", type: "Person" } },
//       tag: {
//         data: [
//           { id: "1", type: "Tag" },
//           { id: "2", type: "Tag" },
//         ],
//       },
//     }

//     expect(
//       convertToJsonApiRelationships(
//         sourceConfig,
//         schemaMap.Article as Schema,
//         relationships,
//       ),
//     ).toEqual(expected)
//   })

//   it("Correctly converts relationship objects for schemas with custom-defined `type` values", () => {
//     const schemaMap = {
//       Article: {
//         name: "Article",
//         displayAttribute: "name",
//         type: "Article",
//         attributes: {
//           title: "string",
//           body: "string",
//         },
//         relationships: {
//           person: {
//             type: "one",
//             schema: "Person",
//           },
//         },
//       },
//       Person: { name: "Person", type: "person_custom", attributes: {} },
//       Tag: { name: "Tag", type: "Tag", attributes: {} },
//     }
//     const sourceConfig = {
//       baseUrl: "http://localhost:3000/api",
//       schemaMap,
//     }

//     const relationships: SchemalessResourceRelationshipObject = {
//       person: { id: "1" },
//     }

//     const expected: Record<string, JsonApiResourceRelationship> = {
//       person: { data: { id: "1", type: "person_custom" } },
//     }

//     expect(
//       convertToJsonApiRelationships(
//         sourceConfig,
//         schemaMap.Article as Schema,
//         relationships,
//       ),
//     ).toEqual(expected)
//   })
// })
