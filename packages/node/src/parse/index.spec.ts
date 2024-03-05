import {
  belongsTo,
  datetime,
  enumerate,
  hasMany,
  integer,
  string,
  uuid,
} from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"
import type { JSONAPIDocument } from "json-api-serializer"
import { Op } from "sequelize"

import { RelationshipPathError, UnexpectedValueError } from "../error/index.js"
import { Hatchify } from "../node.js"

import {
  buildParserForModel,
  buildParserForModelStandalone,
  restoreIds,
} from "./index.js"

const RelationshipPathDetail =
  "URL must have 'include' where 'notrealincludes' is a valid relationship path."

describe("index", () => {
  const User = {
    name: "User",
    attributes: {
      name: string(),
    },
    relationships: {
      todos: hasMany(),
    },
  } satisfies PartialSchema

  const Todo = {
    name: "Todo",
    attributes: {
      name: string(),
      dueDate: datetime(),
      importance: integer(),
      status: enumerate({ values: ["Do Today", "Do Soon", "Done"] }),
    },
    relationships: {
      user: belongsTo(),
    },
  } satisfies PartialSchema

  const hatchedNode = new Hatchify({ Todo, User })

  describe("buildParserForModelStandalone", () => {
    const { findAll, findOne, findAndCountAll, create, update, destroy } =
      buildParserForModelStandalone(hatchedNode, hatchedNode.schema.Todo)

    describe("findAll", () => {
      it("works with ID attribute provided", async () => {
        const results = await findAll(
          "include=user&filter[name]=laundry&fields[Todo]=id,name,dueDate&fields[User]=name&page[number]=3&page[size]=5",
        )

        expect(results).toEqual({
          attributes: ["id", "name", "dueDate"],
          include: [{ association: "user", include: [], attributes: ["name"] }],
          limit: 5,
          offset: 10,
          subQuery: false,
          where: { "$Todo.name$": { [Op.eq]: "laundry" } },
        })
      })

      it("adds ID attribute if not specified", async () => {
        const results = await findAll("fields[Todo]=name,dueDate")

        expect(results).toEqual({
          attributes: ["id", "name", "dueDate"],
          where: {},
        })
      })

      it("handles no attributes", async () => {
        const results = await findAll("")

        expect(results).toEqual({
          where: {},
        })
      })

      it("handles unknown attributes", async () => {
        await expect(async () =>
          findAll("fields[Todo]=invalid"),
        ).rejects.toEqualErrors([
          new UnexpectedValueError({
            detail:
              "URL must have 'fields[Todo]' as comma separated values containing one or more of 'name', 'dueDate', 'importance', 'status', 'userId'.",
            parameter: "fields[Todo]",
          }),
        ])
      })

      it("handles invalid query string", async () => {
        await expect(async () =>
          findAll("fields=name,dueDate"),
        ).rejects.toEqualErrors([
          new UnexpectedValueError({
            detail: "Incorrect format was provided for fields.",
            parameter: "fields",
          }),
        ])
      })

      it("handles invalid include", async () => {
        await expect(async () =>
          findAll("include=notrealincludes"),
        ).rejects.toEqualErrors([
          new RelationshipPathError({
            detail: RelationshipPathDetail,
            parameter: "include",
          }),
        ])
      })
    })

    describe("findAndCountAll", () => {
      it("works with ID attribute provided", async () => {
        const results = await findAndCountAll(
          "include=user&filter[name]=laundry&fields[Todo]=id,name,dueDate&fields[User]=name&page[number]=3&page[size]=5",
        )

        expect(results).toEqual({
          attributes: ["id", "name", "dueDate"],
          include: [{ association: "user", include: [], attributes: ["name"] }],
          limit: 5,
          offset: 10,
          subQuery: false,
          where: { "$Todo.name$": { [Op.eq]: "laundry" } },
        })
      })

      it("adds attribute if not specified", async () => {
        const results = await findAndCountAll("fields[Todo]=name,dueDate")

        expect(results).toEqual({
          attributes: ["id", "name", "dueDate"],
          where: {},
        })
      })

      it("handles no attributes", async () => {
        const results = await findAndCountAll("")

        expect(results).toEqual({
          where: {},
        })
      })

      it("handles unknown attributes", async () => {
        await expect(async () =>
          findAndCountAll("fields[Todo]=invalid"),
        ).rejects.toEqualErrors([
          new UnexpectedValueError({
            detail:
              "URL must have 'fields[Todo]' as comma separated values containing one or more of 'name', 'dueDate', 'importance', 'status', 'userId'.",
            parameter: "fields[Todo]",
          }),
        ])
      })

      it("handles invalid query string", async () => {
        await expect(async () =>
          findAndCountAll("fields=name,dueDate"),
        ).rejects.toEqualErrors([
          new UnexpectedValueError({
            detail: "Incorrect format was provided for fields.",
            parameter: "fields",
          }),
        ])
      })

      it("handles invalid include", async () => {
        await expect(async () =>
          findAndCountAll("include=notrealincludes"),
        ).rejects.toEqualErrors([
          new RelationshipPathError({
            detail: RelationshipPathDetail,
            parameter: "include",
          }),
        ])
      })
    })

    describe("findOne", () => {
      it("works with ID attribute provided", async () => {
        const results = await findOne(
          "include=user&filter[name]=laundry&fields[Todo]=id,name,dueDate&fields[User]=name&page[number]=3&page[size]=5",
          1,
        )

        expect(results).toEqual({
          attributes: ["id", "name", "dueDate"],
          include: [{ association: "user", include: [], attributes: ["name"] }],
          limit: 5,
          offset: 10,
          subQuery: false,
          where: { "$Todo.name$": { [Op.eq]: "laundry" } },
        })
      })

      it("adds ID attribute if not specified", async () => {
        const results = await findOne("fields[Todo]=name,dueDate", 1)

        expect(results).toEqual({
          attributes: ["id", "name", "dueDate"],
          where: { id: 1 },
        })
      })

      it("handles no attributes", async () => {
        const results = await findOne("", 1)

        expect(results).toEqual({
          where: { id: 1 },
        })
      })

      it("handles unknown attributes", async () => {
        await expect(async () =>
          findOne("fields[Todo]=invalid", 1),
        ).rejects.toEqualErrors([
          new UnexpectedValueError({
            detail:
              "URL must have 'fields[Todo]' as comma separated values containing one or more of 'name', 'dueDate', 'importance', 'status', 'userId'.",
            parameter: "fields[Todo]",
          }),
        ])
      })

      it("handles invalid query string", async () => {
        await expect(async () =>
          findOne("fields=name,dueDate", 1),
        ).rejects.toEqualErrors([
          new UnexpectedValueError({
            detail: "Incorrect format was provided for fields.",
            parameter: "fields",
          }),
        ])
      })

      it("handles invalid include", async () => {
        await expect(async () =>
          findOne("include=notrealincludes", 1),
        ).rejects.toEqualErrors([
          new RelationshipPathError({
            detail: RelationshipPathDetail,
            parameter: "include",
          }),
        ])
      })
    })

    describe("create", () => {
      it("works with serialized body", async () => {
        const body = {
          data: {
            type: "Todo",
            attributes: {
              name: "Laundry",
              dueDate: "2024-12-02",
              importance: 1,
              status: "Do Today",
            },
          },
        }
        const results = await create(body as unknown as JSONAPIDocument)

        expect(results).toEqual({ body: body.data.attributes, ops: {} })
      })
    })

    describe("update", () => {
      it("works with ID", async () => {
        const body = {
          data: {
            type: "Todo",
            attributes: {
              name: "Laundry",
              dueDate: "2024-12-02",
              importance: 1,
            },
          },
        }
        const results = await update(body as unknown as JSONAPIDocument, 1)

        expect(results).toEqual({
          body: body.data.attributes,
          ops: { where: { id: 1 } },
        })
      })
    })

    describe("destroy", () => {
      it("works with ID attribute provided", async () => {
        const results = await destroy("28f82f4c-cfa9-4e95-8e88-2e376b184192")

        expect(results).toEqual({
          where: { id: "28f82f4c-cfa9-4e95-8e88-2e376b184192" },
        })
      })
    })
  })

  describe("no relationships case", () => {
    const Todo = {
      name: "Todo",
      attributes: {
        name: string(),
        dueDate: datetime(),
        importance: integer(),
        status: enumerate({ values: ["Do Today", "Do Soon", "Done"] }),
      },
    } satisfies PartialSchema

    const hatchedNode = new Hatchify({ Todo })
    const { findAll } = buildParserForModelStandalone(
      hatchedNode,
      hatchedNode.schema.Todo,
    )

    it("handles invalid include", async () => {
      await expect(async () => findAll("include=user")).rejects.toEqualErrors([
        new RelationshipPathError({
          detail:
            "URL must have 'include' where 'user' is a valid relationship path.",
          parameter: "include",
        }),
      ])
    })
  })

  describe("buildParserForModel", () => {
    it("builds a parser for a model", async () => {
      const parser = buildParserForModel(hatchedNode, "Todo")

      expect(parser.findAll).toEqual(expect.any(Function))
      expect(parser.findAndCountAll).toEqual(expect.any(Function))
      expect(parser.findOne).toEqual(expect.any(Function))
      expect(parser.create).toEqual(expect.any(Function))
      expect(parser.update).toEqual(expect.any(Function))
      expect(parser.destroy).toEqual(expect.any(Function))

      const results = await parser.findAll(
        "include=user&filter[name]=laundry&fields[Todo]=id,name,dueDate&fields[User]=name&page[number]=3&page[size]=5",
      )

      expect(results).toEqual({
        attributes: ["id", "name", "dueDate"],
        include: [{ association: "user", include: [], attributes: ["name"] }],
        limit: 5,
        offset: 10,
        subQuery: false,
        where: { "$Todo.name$": { [Op.eq]: "laundry" } },
      })
    })
  })

  describe("restoreIds", () => {
    it("renames id to the targetKey value", () => {
      const result = restoreIds(
        {
          name: "SalesPerson",
          id: uuid().finalize(),
          attributes: {},
          relationships: {
            accounts: {
              type: "hasManyThrough",
              targetSchema: "Account",
              through: "AccountSalesPerson",
              throughSourceAttribute: "salesPersonId",
              throughTargetAttribute: "accountId",
              sourceKey: "sellerTypeId",
              targetKey: "accountSaleTypeId",
            },
          },
        },
        {
          accounts: [
            {
              id: "23cba2c2-c6e5-411b-a914-7f3d3786a096",
            },
          ],
        },
      )

      expect(result).toEqual({
        accounts: [
          {
            accountSaleTypeId: "23cba2c2-c6e5-411b-a914-7f3d3786a096",
          },
        ],
      })
    })

    it("returns object when there are no custom keys", () => {
      const result = restoreIds(
        {
          name: "Account",
          id: uuid().finalize(),
          attributes: {},
          relationships: {
            aliasedSalesPersons: {
              type: "hasManyThrough",
              targetSchema: "SalesPerson",
              through: "AccountSalesPerson",
              throughSourceAttribute: "accountId",
              throughTargetAttribute: "salesPersonId",
              sourceKey: "id",
              targetKey: "id",
            },
          },
        },
        {},
      )

      expect(result).toEqual({})
    })
  })
})
