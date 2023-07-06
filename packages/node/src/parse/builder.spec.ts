import { Op } from "sequelize"

import {
  buildCreateOptions,
  buildDestroyOptions,
  buildFindOptions,
  buildUpdateOptions,
} from "./builder"
import type { HatchifyModel } from "../types"

describe("builder", () => {
  const Todo: HatchifyModel = {
    name: "Todo",
    attributes: {
      name: "STRING",
      due_date: "DATE",
      importance: "INTEGER",
    },
    belongsTo: [{ target: "User", options: { as: "user" } }],
  }

  describe("buildFindOptions", () => {
    it("works with ID attribute provided", () => {
      const options = buildFindOptions(
        Todo,
        "include=user&filter[name]=laundry&fields[Todo]=id,name,due_date&fields[User]=name&page[number]=3&page[size]=5&sort=-date,name",
      )

      expect(options).toEqual({
        data: {
          attributes: ["id", "name", "due_date"],
          include: [{ association: "user", include: [] }],
          limit: 5,
          offset: 10,
          where: { name: { [Op.like]: "%laundry%" } },
          order: [
            ["date", "DESC"],
            ["name", "ASC"],
          ],
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("adds ID attribute if not specified", () => {
      const options = buildFindOptions(Todo, "fields[Todo]=name,due_date")

      expect(options).toEqual({
        data: {
          attributes: ["id", "name", "due_date"],
          where: {},
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("ignores ID if any filter provided", () => {
      const options = buildFindOptions(Todo, "page[number]=1&page[size]=10", 1)

      expect(options).toEqual({
        data: {
          where: { id: 1 },
          limit: 10,
          offset: 0,
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("handles non-positive pagination parameters", () => {
      const options = buildFindOptions(Todo, "page[number]=0&page[size]=0")

      expect(options).toEqual({
        data: {},
        errors: [expect.any(Error), expect.any(Error)],
        orm: "sequelize",
      })

      const errors = options.errors as unknown as Error[]
      expect(errors[0].name).toEqual("QuerystringParsingError")
      expect(errors[0].message).toEqual(
        "Page number should be a positive integer.",
      )
      expect(errors[1].name).toEqual("QuerystringParsingError")
      expect(errors[1].message).toEqual(
        "Page size should be a positive integer.",
      )
    })

    it("handles no attributes", () => {
      const options = buildFindOptions(Todo, "")

      expect(options).toEqual({
        data: { where: {} },
        errors: [],
        orm: "sequelize",
      })
    })

    it("handles unknown attributes", () => {
      const options = buildFindOptions(Todo, "fields[Todo]=invalid")

      expect(options).toEqual({
        data: { attributes: ["id", "invalid"], where: {} },
        errors: [new Error("Unknown attribute invalid")],
        orm: "sequelize",
      })
    })

    it("handles invalid query string", () => {
      const options = buildFindOptions(Todo, "fields=name,due_date")

      expect(options).toEqual({
        data: {},
        errors: [expect.any(Error)],
        orm: "sequelize",
      })

      const error = options.errors[0] as unknown as Error
      expect(error.name).toEqual("QuerystringParsingError")
      expect(error.message).toEqual("Incorrect format was provided for fields.")
    })
  })

  describe("buildCreateOptions", () => {
    it("works with ID attribute provided", () => {
      const options = buildCreateOptions(
        "include=user&filter[name]=laundry&fields[Todo]=id,name,due_date&fields[User]=name&page[number]=3&page[size]=5",
      )

      expect(options).toEqual({
        data: {
          attributes: ["id", "name", "due_date"],
          include: [{ association: "user", include: [] }],
          limit: 5,
          offset: 10,
          where: { name: { [Op.like]: "%laundry%" } },
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("handles invalid query string", () => {
      const options = buildCreateOptions("fields=name,due_date")

      expect(options).toEqual({
        data: {},
        errors: [expect.any(Error)],
        orm: "sequelize",
      })

      const error = options.errors[0] as unknown as Error
      expect(error.name).toEqual("QuerystringParsingError")
      expect(error.message).toEqual("Incorrect format was provided for fields.")
    })
  })

  describe("buildUpdateOptions", () => {
    it("works with ID attribute provided", () => {
      const options = buildUpdateOptions(
        "include=user&filter[name]=laundry&fields[Todo]=id,name,due_date&fields[User]=name&page[number]=3&page[size]=5",
      )

      expect(options).toEqual({
        data: {
          attributes: ["id", "name", "due_date"],
          include: [{ association: "user", include: [] }],
          limit: 5,
          offset: 10,
          where: { name: { [Op.like]: "%laundry%" } },
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("does not add ID attribute if not specified", () => {
      const options = buildUpdateOptions("fields[Todo]=name,due_date")

      expect(options).toEqual({
        data: {
          attributes: ["name", "due_date"],
          where: {},
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("ignores ID if any filter provided", () => {
      const options = buildUpdateOptions("page[number]=1&page[size]=10", 1)

      expect(options).toEqual({
        data: {
          where: { id: 1 },
          limit: 10,
          offset: 0,
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("handles no attributes", () => {
      const options = buildUpdateOptions("")

      expect(options).toEqual({
        data: { where: {} },
        errors: [],
        orm: "sequelize",
      })
    })

    it("does not error on unknown attributes", () => {
      const options = buildUpdateOptions("fields[Todo]=invalid")

      expect(options).toEqual({
        data: { attributes: ["invalid"], where: {} },
        errors: [],
        orm: "sequelize",
      })
    })

    it("handles invalid query string", () => {
      const options = buildUpdateOptions("fields=name,due_date")

      expect(options).toEqual({
        data: {},
        errors: [expect.any(Error)],
        orm: "sequelize",
      })

      const error = options.errors[0] as unknown as Error
      expect(error.name).toEqual("QuerystringParsingError")
      expect(error.message).toEqual("Incorrect format was provided for fields.")
    })
  })

  describe("buildDestroyOptions", () => {
    it("works with ID attribute provided", () => {
      const options = buildDestroyOptions(
        "include=user&filter[name]=laundry&fields[Todo]=id,name,due_date&fields[User]=name&page[number]=3&page[size]=5",
      )

      expect(options).toEqual({
        data: {
          attributes: ["id", "name", "due_date"],
          include: [{ association: "user", include: [] }],
          limit: 5,
          offset: 10,
          where: { name: { [Op.like]: "%laundry%" } },
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("does not add ID attribute if not specified", () => {
      const options = buildDestroyOptions("fields[Todo]=name,due_date")

      expect(options).toEqual({
        data: {
          attributes: ["name", "due_date"],
          where: {},
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("ignores ID if any filter provided", () => {
      const options = buildDestroyOptions("page[number]=1&page[size]=10", 1)

      expect(options).toEqual({
        data: {
          where: { id: 1 },
          limit: 10,
          offset: 0,
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("handles no attributes", () => {
      const options = buildDestroyOptions("")

      expect(options).toEqual({
        data: { where: {} },
        errors: [],
        orm: "sequelize",
      })
    })

    it("does not error on unknown attributes", () => {
      const options = buildDestroyOptions("fields[Todo]=invalid")

      expect(options).toEqual({
        data: { attributes: ["invalid"], where: {} },
        errors: [],
        orm: "sequelize",
      })
    })

    it("handles invalid query string", () => {
      const options = buildDestroyOptions("fields=name,due_date")

      expect(options).toEqual({
        data: {},
        errors: [expect.any(Error)],
        orm: "sequelize",
      })

      const error = options.errors[0] as unknown as Error
      expect(error.name).toEqual("QuerystringParsingError")
      expect(error.message).toEqual("Incorrect format was provided for fields.")
    })
  })
})
