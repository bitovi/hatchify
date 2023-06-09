import { Op } from "sequelize"

import { ValidationError, codes, statusCodes } from "../error"
import { Hatchify } from "../node"
import type { HatchifyModel } from "../types"

import { buildParserForModel, buildParserForModelStandalone } from "."

describe("index", () => {
  const User: HatchifyModel = {
    name: "User",
    attributes: {
      name: "STRING",
    },
    hasMany: [{ target: "Todo", options: { as: "todos" } }],
  }

  const Todo: HatchifyModel = {
    name: "Todo",
    attributes: {
      name: "STRING",
      due_date: "DATE",
      importance: "INTEGER",
    },
    belongsTo: [{ target: "User", options: { as: "user" } }],
  }

  const hatchedNode = new Hatchify([Todo, User])

  describe("buildParserForModelStandalone", () => {
    const { findAll, findOne, findAndCountAll, create, update, destroy } =
      buildParserForModelStandalone(hatchedNode, Todo)

    describe("findAll", () => {
      it("works with ID attribute provided", async () => {
        const results = await findAll(
          "include=user&filter[name]=laundry&fields[Todo]=id,name,due_date&fields[User]=name&page[number]=3&page[size]=5",
        )

        expect(results).toEqual({
          attributes: ["id", "name", "due_date"],
          include: [{ association: "user", include: [] }],
          limit: 5,
          offset: 10,
          where: { name: { [Op.like]: "%laundry%" } },
        })
      })

      it("adds ID attribute if not specified", async () => {
        const results = await findAll("fields[Todo]=name,due_date")

        expect(results).toEqual({
          attributes: ["id", "name", "due_date"],
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
        await expect(findAll("fields[Todo]=invalid")).rejects.toEqual(
          new ValidationError({
            code: codes.ERR_INVALID_PARAMETER,
            status: statusCodes.UNPROCESSABLE_ENTITY,
            title: "Bad Request, Invalid Query String",
          }),
        )
      })

      it("handles invalid query string", async () => {
        await expect(findAll("fields=name,due_date")).rejects.toEqual(
          new ValidationError({
            code: codes.ERR_INVALID_PARAMETER,
            status: statusCodes.UNPROCESSABLE_ENTITY,
            title: "Bad Request, Invalid Query String",
          }),
        )
      })
    })

    describe("findAndCountAll", () => {
      it("works with ID attribute provided", async () => {
        const results = await findAndCountAll(
          "include=user&filter[name]=laundry&fields[Todo]=id,name,due_date&fields[User]=name&page[number]=3&page[size]=5",
        )

        expect(results).toEqual({
          attributes: ["id", "name", "due_date"],
          include: [{ association: "user", include: [] }],
          limit: 5,
          offset: 10,
          where: { name: { [Op.like]: "%laundry%" } },
        })
      })

      it("adds attribute if not specified", async () => {
        const results = await findAndCountAll("fields[Todo]=name,due_date")

        expect(results).toEqual({
          attributes: ["id", "name", "due_date"],
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
        await expect(findAndCountAll("fields[Todo]=invalid")).rejects.toEqual(
          new ValidationError({
            code: codes.ERR_INVALID_PARAMETER,
            status: statusCodes.UNPROCESSABLE_ENTITY,
            title: "Bad Request, Invalid Query String",
          }),
        )
      })

      it("handles invalid query string", async () => {
        await expect(findAndCountAll("fields=name,due_date")).rejects.toEqual(
          new ValidationError({
            code: codes.ERR_INVALID_PARAMETER,
            status: statusCodes.UNPROCESSABLE_ENTITY,
            title: "Bad Request, Invalid Query String",
          }),
        )
      })
    })

    describe("findOne", () => {
      it("works with ID attribute provided", async () => {
        const results = await findOne(
          "include=user&filter[name]=laundry&fields[Todo]=id,name,due_date&fields[User]=name&page[number]=3&page[size]=5",
          1,
        )

        expect(results).toEqual({
          attributes: ["id", "name", "due_date"],
          include: [{ association: "user", include: [] }],
          limit: 5,
          offset: 10,
          where: { name: { [Op.like]: "%laundry%" } },
        })
      })

      it("adds ID attribute if not specified", async () => {
        const results = await findOne("fields[Todo]=name,due_date", 1)

        expect(results).toEqual({
          attributes: ["id", "name", "due_date"],
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
        await expect(findOne("fields[Todo]=invalid", 1)).rejects.toEqual(
          new ValidationError({
            code: codes.ERR_INVALID_PARAMETER,
            status: statusCodes.UNPROCESSABLE_ENTITY,
            title: "Bad Request, Invalid Query String",
          }),
        )
      })

      it("handles invalid query string", async () => {
        await expect(findOne("fields=name,due_date", 1)).rejects.toEqual(
          new ValidationError({
            code: codes.ERR_INVALID_PARAMETER,
            status: statusCodes.UNPROCESSABLE_ENTITY,
            title: "Bad Request, Invalid Query String",
          }),
        )
      })
    })

    describe("create", () => {
      it("works with serialized body", async () => {
        const body = {
          data: {
            type: "Todo",
            attributes: {
              name: "Laundry",
              due_date: "2024-12-02",
              importance: 1,
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
              due_date: "2024-12-02",
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
              due_date: "2024-12-02",
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
          "include=user&filter[name]=laundry&fields[Todo]=id,name,due_date&fields[User]=name&page[number]=3&page[size]=5",
        )

        expect(results).toEqual({
          attributes: ["id", "name", "due_date"],
          include: [{ association: "user", include: [] }],
          limit: 5,
          offset: 10,
          where: { name: { [Op.like]: "%laundry%" } },
        })
      })

      it("does not add ID attribute if not specified", async () => {
        const results = await destroy("fields[Todo]=name,due_date")

        expect(results).toEqual({
          attributes: ["name", "due_date"],
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
        const results = await destroy("fields[Todo]=invalid")

        expect(results).toEqual({
          attributes: ["invalid"],
          where: {},
        })
      })

      it("handles invalid query string", async () => {
        await expect(destroy("fields=name,due_date")).rejects.toEqual(
          new ValidationError({
            code: codes.ERR_INVALID_PARAMETER,
            status: statusCodes.UNPROCESSABLE_ENTITY,
            title: "Bad Request, Invalid Query String",
          }),
        )
      })
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
        "include=user&filter[name]=laundry&fields[Todo]=id,name,due_date&fields[User]=name&page[number]=3&page[size]=5",
      )

      expect(results).toEqual({
        attributes: ["id", "name", "due_date"],
        include: [{ association: "user", include: [] }],
        limit: 5,
        offset: 10,
        where: { name: { [Op.like]: "%laundry%" } },
      })
    })
  })
})
