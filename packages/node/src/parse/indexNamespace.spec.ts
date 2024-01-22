import {
  belongsTo,
  datetime,
  enumerate,
  hasMany,
  integer,
  string,
} from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"
import { Op } from "sequelize"

import { RelationshipPathError, UnexpectedValueError } from "../error/index.js"
import { Hatchify } from "../node.js"

import { buildParserForModel, buildParserForModelStandalone } from "./index.js"

const RelationshipPathDetail =
  "URL must have 'include' as one or more of 'lipitorUser', 'xanaxUser'."

describe("indexNamespace", () => {
  const Lipitor_User_Schema = {
    name: "User",
    namespace: "Lipitor",
    attributes: {
      name: string(),
    },
    relationships: {
      lipitorTodos: hasMany("Pfizer_Todo"),
    },
  } satisfies PartialSchema
  const Xanax_User_Schema = {
    name: "User",
    namespace: "Xanax",
    attributes: {
      name: string(),
    },
    relationships: {
      xanaxTodos: hasMany("Pfizer_Todo"),
    },
  } satisfies PartialSchema

  const Pfizer_Todo_Schema = {
    name: "Todo",
    namespace: "Pfizer",
    attributes: {
      name: string(),
      dueDate: datetime(),
      importance: integer(),
      status: enumerate({ values: ["Do Today", "Do Soon", "Done"] }),
    },
    relationships: {
      lipitorUser: belongsTo("Lipitor_User"),
      xanaxUser: belongsTo("Xanax_User"),
    },
  } satisfies PartialSchema

  const hatchedNode = new Hatchify({
    Pfizer_Todo: Pfizer_Todo_Schema,
    Lipitor_User: Lipitor_User_Schema,
    Xanax_User: Xanax_User_Schema,
  })

  const { Pfizer_Todo } = hatchedNode.schema

  describe("buildParserForModelStandalone", () => {
    const { findAll, findOne, findAndCountAll, create, update, destroy } =
      buildParserForModelStandalone(hatchedNode, Pfizer_Todo)

    describe("findAll", () => {
      it("works with ID attribute provided", async () => {
        const results = await findAll(
          "include=lipitorUser&filter[name]=laundry&fields[Pfizer_Todo]=id,name,dueDate&fields[Lipitor_User]=name&page[number]=3&page[size]=5",
        )

        expect(results).toEqual({
          attributes: ["id", "name", "dueDate"],
          include: [
            { association: "lipitorUser", include: [], attributes: ["name"] },
          ],
          limit: 5,
          offset: 10,
          subQuery: false,
          where: { "$Pfizer_Todo.name$": { [Op.eq]: "laundry" } },
        })
      })

      it("adds ID attribute if not specified", async () => {
        const results = await findAll("fields[Pfizer_Todo]=name,dueDate")

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
          "include=xanaxUser&filter[name]=laundry&fields[Pfizer_Todo]=id,name,dueDate&fields[Xanax_User]=name&page[number]=3&page[size]=5",
        )

        expect(results).toEqual({
          attributes: ["id", "name", "dueDate"],
          include: [
            { association: "xanaxUser", include: [], attributes: ["name"] },
          ],
          limit: 5,
          offset: 10,
          subQuery: false,
          where: { "$Pfizer_Todo.name$": { [Op.eq]: "laundry" } },
        })
      })

      it("adds attribute if not specified", async () => {
        const results = await findAndCountAll(
          "fields[Pfizer_Todo]=name,dueDate",
        )

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
          "include=xanaxUser&filter[name]=laundry&fields[Pfizer_Todo]=id,name,dueDate&fields[Xanax_User]=name&page[number]=3&page[size]=5",
          1,
        )

        expect(results).toEqual({
          attributes: ["id", "name", "dueDate"],
          include: [
            { association: "xanaxUser", include: [], attributes: ["name"] },
          ],
          limit: 5,
          offset: 10,
          subQuery: false,
          where: { "$Pfizer_Todo.name$": { [Op.eq]: "laundry" } },
        })
      })

      it("adds ID attribute if not specified", async () => {
        const results = await findOne("fields[Pfizer_Todo]=name,dueDate", 1)

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
            type: "Pfizer_Todo",
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
            type: "Pfizer_Todo",
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
            type: "Pfizer_Todo",
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
          "include=xanaxUser&filter[name]=laundry&fields[Pfizer_Todo]=id,name,dueDate&fields[Xanax_User]=name&page[number]=3&page[size]=5",
        )

        expect(results).toEqual({
          attributes: ["id", "name", "dueDate"],
          include: [
            { association: "xanaxUser", include: [], attributes: ["name"] },
          ],
          limit: 5,
          offset: 10,
          subQuery: false,
          where: { name: { [Op.eq]: "laundry" } },
        })
      })

      it("does not add ID attribute if not specified", async () => {
        const results = await destroy("fields[Pfizer_Todo]=name,dueDate")

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
          subQuery: false,
        })
      })

      it("handles no attributes", async () => {
        const results = await destroy("")

        expect(results).toEqual({
          where: {},
        })
      })

      it("does not error on unknown attributes", async () => {
        const results = await destroy("fields[Pfizer_Todo]=invalid")

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
      const parser = buildParserForModel(hatchedNode, "Pfizer_Todo")

      expect(parser.findAll).toEqual(expect.any(Function))
      expect(parser.findAndCountAll).toEqual(expect.any(Function))
      expect(parser.findOne).toEqual(expect.any(Function))
      expect(parser.create).toEqual(expect.any(Function))
      expect(parser.update).toEqual(expect.any(Function))
      expect(parser.destroy).toEqual(expect.any(Function))

      const results = await parser.findAll(
        "include=xanaxUser&filter[name]=laundry&fields[Pfizer_Todo]=id,name,dueDate&fields[Xanax_User]=name&page[number]=3&page[size]=5",
      )

      expect(results).toEqual({
        attributes: ["id", "name", "dueDate"],
        include: [
          { association: "xanaxUser", include: [], attributes: ["name"] },
        ],
        limit: 5,
        offset: 10,
        subQuery: false,
        where: { "$Pfizer_Todo.name$": { [Op.eq]: "laundry" } },
      })
    })
  })
})
