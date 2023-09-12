import { Op } from "sequelize"

import {
  buildCreateOptions,
  buildDestroyOptions,
  buildFindOptions,
  buildUpdateOptions,
} from "./builder"
import { UnexpectedValueError } from "../error"
import { Hatchify } from "../node"
import type { HatchifyModel } from "../types"

describe("builder", () => {
  const User: HatchifyModel = {
    name: "User",
    attributes: {
      name: "STRING",
    },
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
  const hatchify = new Hatchify([User, Todo], { prefix: "/api" })

  describe("buildFindOptions", () => {
    it("works with ID attribute provided", () => {
      const options = buildFindOptions(
        hatchify,
        Todo,
        "include=user&filter[name]=laundry&fields[todo]=id,name,due_date&fields[user]=name&page[number]=3&page[size]=5&sort=-due_date,name",
      )

      expect(options).toEqual({
        data: {
          attributes: ["id", "name", "due_date"],
          include: [{ association: "user", include: [] }],
          limit: 5,
          offset: 10,
          where: { name: { [Op.eq]: "laundry" } },
          order: [
            ["due_date", "DESC"],
            ["name", "ASC"],
          ],
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("adds ID attribute if not specified", () => {
      const options = buildFindOptions(
        hatchify,
        Todo,
        "fields[todo]=name,due_date",
      )

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
      const options = buildFindOptions(
        hatchify,
        Todo,
        "page[number]=1&page[size]=10",
        1,
      )

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

    it("handles zero pagination parameters", async () => {
      await expect(async () =>
        buildFindOptions(hatchify, Todo, "page[number]=0&page[size]=0"),
      ).rejects.toEqualErrors([
        new UnexpectedValueError({
          detail: "Page number should be a positive integer.",
          parameter: "page[number]",
        }),
        new UnexpectedValueError({
          detail: "Page size should be a positive integer.",
          parameter: "page[size]",
        }),
      ])
    })

    it("handles negative pagination parameters", async () => {
      await expect(async () =>
        buildFindOptions(hatchify, Todo, "page[number]=-1&page[size]=-1"),
      ).rejects.toEqualErrors([
        new UnexpectedValueError({
          detail: "Page number should be a positive integer.",
          parameter: "page[number]",
        }),
        new UnexpectedValueError({
          detail: "Page size should be a positive integer.",
          parameter: "page[size]",
        }),
      ])
    })

    it("handles float pagination parameters", async () => {
      await expect(async () =>
        buildFindOptions(hatchify, Todo, "page[number]=2.1&page[size]=1.1"),
      ).rejects.toEqualErrors([
        new UnexpectedValueError({
          detail: "Page number should be a positive integer.",
          parameter: "page[number]",
        }),
        new UnexpectedValueError({
          detail: "Page size should be a positive integer.",
          parameter: "page[size]",
        }),
      ])
    })

    it("handles no attributes", () => {
      const options = buildFindOptions(hatchify, Todo, "")

      expect(options).toEqual({
        data: { where: {} },
        errors: [],
        orm: "sequelize",
      })
    })

    it("handles unknown attributes", async () => {
      await expect(async () =>
        buildFindOptions(hatchify, Todo, "fields[todo]=invalid"),
      ).rejects.toEqualErrors([
        new UnexpectedValueError({
          detail: `URL must have 'fields[todo]' as comma separated values containing one or more of 'name', 'due_date', 'importance'.`,
          parameter: `fields[todo]`,
        }),
      ])
    })

    it("handles unknown filter fields", async () => {
      await expect(async () =>
        buildFindOptions(hatchify, Todo, "filter[namee][]=test"),
      ).rejects.toEqualErrors([
        new UnexpectedValueError({
          detail: `URL must have 'filter[x]' where 'x' is one of 'name', 'due_date', 'importance'.`,
          parameter: "filter[namee]",
        }),
      ])
    })

    it("handles unknown sort fields", async () => {
      await expect(async () =>
        buildFindOptions(hatchify, Todo, "sort=invalid"),
      ).rejects.toEqualErrors([
        new UnexpectedValueError({
          detail: `URL must have 'sort' as comma separated values containing one or more of 'name', 'due_date', 'importance'.`,
          parameter: `sort`,
        }),
      ])
    })

    it("handles invalid query string", async () => {
      await expect(async () =>
        buildFindOptions(hatchify, Todo, "fields=name,due_date"),
      ).rejects.toEqualErrors([
        new UnexpectedValueError({
          detail: "Incorrect format was provided for fields.",
          parameter: "fields",
        }),
      ])
    })

    it("does not convert LIKE for Sqlite", async () => {
      const options = buildFindOptions(
        hatchify,
        Todo,
        "filter[name][$like]=test%25",
      )

      expect(options).toEqual({
        data: {
          where: { name: { [Op.like]: "test%" } },
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("converts LIKE ANY for Sqlite", async () => {
      const options = buildFindOptions(
        hatchify,
        Todo,
        "filter[name][$like]=test,foo",
      )

      expect(options).toEqual({
        data: {
          where: {
            name: {
              [Op.or]: [{ [Op.like]: "test" }, { [Op.like]: "foo" }],
            },
          },
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("converts ILIKE for Sqlite", async () => {
      const options = buildFindOptions(
        hatchify,
        Todo,
        "filter[name][$ilike]=test",
      )

      expect(options).toEqual({
        data: {
          where: {
            [Op.and]: [
              {
                attribute: {
                  args: [
                    {
                      col: "name",
                    },
                  ],
                  fn: "upper",
                },
                comparator: Op.like,
                logic: "TEST",
              },
            ],
          },
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("converts ILIKE ANY for Sqlite", async () => {
      const options = buildFindOptions(
        hatchify,
        Todo,
        "filter[name][$ilike]=test,foo",
      )

      expect(options).toEqual({
        data: {
          where: {
            [Op.or]: [
              {
                attribute: {
                  args: [
                    {
                      col: "name",
                    },
                  ],
                  fn: "upper",
                },
                comparator: Op.like,
                logic: "TEST",
              },
              {
                attribute: {
                  args: [
                    {
                      col: "name",
                    },
                  ],
                  fn: "upper",
                },
                comparator: Op.like,
                logic: "FOO",
              },
            ],
          },
        },
        errors: [],
        orm: "sequelize",
      })
    })
  })

  describe("buildCreateOptions", () => {
    it("works with ID attribute provided", () => {
      const options = buildCreateOptions(
        "include=user&filter[name]=laundry&fields[todo]=id,name,due_date&fields[user]=name&page[number]=3&page[size]=5",
      )

      expect(options).toEqual({
        data: {
          attributes: ["id", "name", "due_date"],
          include: [{ association: "user", include: [] }],
          limit: 5,
          offset: 10,
          where: { name: { [Op.eq]: "laundry" } },
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
        "include=user&filter[name]=laundry&fields[todo]=id,name,due_date&fields[user]=name&page[number]=3&page[size]=5",
      )

      expect(options).toEqual({
        data: {
          attributes: ["id", "name", "due_date"],
          include: [{ association: "user", include: [] }],
          limit: 5,
          offset: 10,
          where: { name: { [Op.eq]: "laundry" } },
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("does not add ID attribute if not specified", () => {
      const options = buildUpdateOptions("fields[todo]=name,due_date")

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
      const options = buildUpdateOptions("fields[todo]=invalid")

      expect(options).toEqual({
        data: { attributes: ["invalid"], where: {} },
        errors: [],
        orm: "sequelize",
      })
    })

    it("handles invalid query string", async () => {
      await expect(async () =>
        buildUpdateOptions("fields=name,due_date"),
      ).rejects.toEqualErrors([
        new UnexpectedValueError({
          detail: "Incorrect format was provided for fields.",
          parameter: "fields",
        }),
      ])
    })
  })

  describe("buildDestroyOptions", () => {
    it("works with ID attribute provided", () => {
      const options = buildDestroyOptions(
        "include=user&filter[name]=laundry&fields[todo]=id,name,due_date&fields[user]=name&page[number]=3&page[size]=5",
      )

      expect(options).toEqual({
        data: {
          attributes: ["id", "name", "due_date"],
          include: [{ association: "user", include: [] }],
          limit: 5,
          offset: 10,
          where: { name: { [Op.eq]: "laundry" } },
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("does not add ID attribute if not specified", () => {
      const options = buildDestroyOptions("fields[todo]=name,due_date")

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
      const options = buildDestroyOptions("fields[todo]=invalid")

      expect(options).toEqual({
        data: { attributes: ["invalid"], where: {} },
        errors: [],
        orm: "sequelize",
      })
    })

    it("handles invalid query string", async () => {
      await expect(async () =>
        buildDestroyOptions("fields=name,due_date"),
      ).rejects.toEqualErrors([
        new UnexpectedValueError({
          detail: "Incorrect format was provided for fields.",
          parameter: "fields",
        }),
      ])
    })
  })
})
