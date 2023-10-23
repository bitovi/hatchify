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
import { Op } from "sequelize"

import { RelationshipPathError, UnexpectedValueError } from "../error"
import { Hatchify } from "../node"

import {
  buildParserForModel,
  buildParserForModelStandalone,
  restoreIds,
} from "."

const RelationshipPathDetail =
  "URL must have 'include' as one or more of 'user'."

describe("index", () => {
  const User: PartialSchema = {
    name: "User",
    attributes: {
      name: string(),
    },
    relationships: {
      todos: hasMany(),
    },
  }

  const Todo: PartialSchema = {
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
  }

  const hatchedNode = new Hatchify({ Todo, User })

  describe("buildParserForModelStandalone", () => {
    const { findAll, findOne, findAndCountAll, create, update, destroy } =
      buildParserForModelStandalone(hatchedNode, hatchedNode.schema.Todo)

    describe("findAll", () => {
      it("works with ID attribute provided", async () => {
        const results = await findAll(
          "include=user&filter[name]=laundry&fields[todo]=id,name,dueDate&fields[user]=name&page[number]=3&page[size]=5",
        )

        expect(results).toEqual({
          attributes: ["id", "name", "dueDate"],
          include: [{ association: "user", include: [] }],
          limit: 5,
          offset: 10,
          where: { "$Todo.name$": { [Op.eq]: "laundry" } },
        })
      })

      it("adds ID attribute if not specified", async () => {
        const results = await findAll("fields[todo]=name,dueDate")

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
        await expect(findAll("fields[todo]=invalid")).rejects.toEqualErrors([
          new UnexpectedValueError({
            detail:
              "URL must have 'fields[todo]' as comma separated values containing one or more of 'name', 'dueDate', 'importance', 'status', 'userId'.",
            parameter: "fields[todo]",
          }),
        ])
      })

      it("handles invalid query string", async () => {
        await expect(findAll("fields=name,dueDate")).rejects.toEqualErrors([
          new UnexpectedValueError({
            detail: "Incorrect format was provided for fields.",
            parameter: "fields",
          }),
        ])
      })

      it("handles invalid include", async () => {
        await expect(findAll("include=notrealincludes")).rejects.toEqualErrors([
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
          "include=user&filter[name]=laundry&fields[todo]=id,name,dueDate&fields[user]=name&page[number]=3&page[size]=5",
        )

        expect(results).toEqual({
          attributes: ["id", "name", "dueDate"],
          include: [{ association: "user", include: [] }],
          limit: 5,
          offset: 10,
          where: { "$Todo.name$": { [Op.eq]: "laundry" } },
        })
      })

      it("adds attribute if not specified", async () => {
        const results = await findAndCountAll("fields[todo]=name,dueDate")

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
        await expect(
          findAndCountAll("fields[todo]=invalid"),
        ).rejects.toEqualErrors([
          new UnexpectedValueError({
            detail:
              "URL must have 'fields[todo]' as comma separated values containing one or more of 'name', 'dueDate', 'importance', 'status', 'userId'.",
            parameter: "fields[todo]",
          }),
        ])
      })

      it("handles invalid query string", async () => {
        await expect(
          findAndCountAll("fields=name,dueDate"),
        ).rejects.toEqualErrors([
          new UnexpectedValueError({
            detail: "Incorrect format was provided for fields.",
            parameter: "fields",
          }),
        ])
      })

      it("handles invalid include", async () => {
        await expect(
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
          "include=user&filter[name]=laundry&fields[todo]=id,name,dueDate&fields[user]=name&page[number]=3&page[size]=5",
          1,
        )

        expect(results).toEqual({
          attributes: ["id", "name", "dueDate"],
          include: [{ association: "user", include: [] }],
          limit: 5,
          offset: 10,
          where: { "$Todo.name$": { [Op.eq]: "laundry" } },
        })
      })

      it("adds ID attribute if not specified", async () => {
        const results = await findOne("fields[todo]=name,dueDate", 1)

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
        await expect(findOne("fields[todo]=invalid", 1)).rejects.toEqualErrors([
          new UnexpectedValueError({
            detail:
              "URL must have 'fields[todo]' as comma separated values containing one or more of 'name', 'dueDate', 'importance', 'status', 'userId'.",
            parameter: "fields[todo]",
          }),
        ])
      })

      it("handles invalid query string", async () => {
        await expect(findOne("fields=name,dueDate", 1)).rejects.toEqualErrors([
          new UnexpectedValueError({
            detail: "Incorrect format was provided for fields.",
            parameter: "fields",
          }),
        ])
      })

      it("handles invalid include", async () => {
        await expect(
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
        const results = await create(body)

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
        const results = await update(body, 1)

        expect(results).toEqual({
          body: body.data.attributes,
          ops: { where: { id: 1 } },
        })
      })

      it("works without ID", async () => {
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
        const results = await update(body)

        expect(results).toEqual({
          body: body.data.attributes,
          ops: { where: {} },
        })
      })
    })

    describe("destroy", () => {
      it("works with ID attribute provided", async () => {
        const results = await destroy(
          "include=user&filter[name]=laundry&fields[todo]=id,name,dueDate&fields[user]=name&page[number]=3&page[size]=5",
        )

        expect(results).toEqual({
          attributes: ["id", "name", "dueDate"],
          include: [{ association: "user", include: [] }],
          limit: 5,
          offset: 10,
          where: { name: { [Op.eq]: "laundry" } },
        })
      })

      it("does not add ID attribute if not specified", async () => {
        const results = await destroy("fields[todo]=name,dueDate")

        expect(results).toEqual({
          attributes: ["name", "dueDate"],
          where: {},
        })
      })

      it("ignores ID if any filter provided", async () => {
        const results = await destroy("page[number]=1&page[size]=10", 1)

        expect(results).toEqual({
          where: { id: 1 },
          limit: 10,
          offset: 0,
        })
      })

      it("handles no attributes", async () => {
        const results = await destroy("")

        expect(results).toEqual({
          where: {},
        })
      })

      it("does not error on unknown attributes", async () => {
        const results = await destroy("fields[todo]=invalid")

        expect(results).toEqual({
          attributes: ["invalid"],
          where: {},
        })
      })

      it("handles invalid query string", async () => {
        await expect(destroy("fields=name,dueDate")).rejects.toEqualErrors([
          new UnexpectedValueError({
            detail: "Incorrect format was provided for fields.",
            parameter: "fields",
          }),
        ])
      })
    })
  })

  describe("no relationships case", () => {
    const Todo: PartialSchema = {
      name: "Todo",
      attributes: {
        name: string(),
        dueDate: datetime(),
        importance: integer(),
        status: enumerate({ values: ["Do Today", "Do Soon", "Done"] }),
      },
    }

    const hatchedNode = new Hatchify({ Todo })
    const { findAll } = buildParserForModelStandalone(
      hatchedNode,
      hatchedNode.schema.Todo,
    )

    it("handles invalid include", async () => {
      await expect(findAll("include=user")).rejects.toEqualErrors([
        new RelationshipPathError({
          detail: "URL must not have 'include' as a parameter.",
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
        "include=user&filter[name]=laundry&fields[todo]=id,name,dueDate&fields[user]=name&page[number]=3&page[size]=5",
      )

      expect(results).toEqual({
        attributes: ["id", "name", "dueDate"],
        include: [{ association: "user", include: [] }],
        limit: 5,
        offset: 10,
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
  })
})
