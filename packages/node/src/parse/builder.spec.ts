import { belongsTo, datetime, hasMany, integer, string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"
import { Op } from "sequelize"

import {
  buildCreateOptions,
  buildDestroyOptions,
  buildFindOptions,
  buildUpdateOptions,
} from "./builder"
import { UnexpectedValueError } from "../error"
import { Hatchify } from "../node"

describe("builder", () => {
  const UserSchema: PartialSchema = {
    name: "User",
    attributes: {
      name: string(),
    },
    relationships: {
      user: belongsTo(),
      todos: hasMany(),
    },
  }
  const TodoSchema: PartialSchema = {
    name: "Todo",
    attributes: {
      name: string(),
      dueDate: datetime(),
      importance: integer(),
    },
    relationships: {
      user: belongsTo(),
    },
  }
  const DisconnectedSchemaSchema: PartialSchema = {
    name: "DisconnectedSchema",
    attributes: {
      name: string(),
      importance: integer(),
    },
  }
  const hatchify = new Hatchify(
    {
      User: UserSchema,
      Todo: TodoSchema,
      DisconnectedSchema: DisconnectedSchemaSchema,
    },
    { prefix: "/api" },
  )

  const { User, Todo, DisconnectedSchema } = hatchify.schema

  describe("buildFindOptions", () => {
    it("works with ID attribute provided", () => {
      const options = buildFindOptions(
        hatchify,
        Todo,
        "include=user&filter[name]=laundry&fields[]=id,name,dueDate&fields[user]=name&page[number]=3&page[size]=5&sort=-dueDate,name",
      )

      expect(options).toEqual({
        data: {
          attributes: ["id", "name", "dueDate"],
          include: [{ association: "user", include: [], attributes: ["name"] }],
          limit: 5,
          offset: 10,
          subQuery: false,
          where: { "$Todo.name$": { [Op.eq]: "laundry" } },
          order: [
            ["dueDate", "DESC"],
            ["name", "ASC"],
          ],
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("adds ID attribute if not specified", () => {
      const options = buildFindOptions(hatchify, Todo, "fields[]=name,dueDate")

      expect(options).toEqual({
        data: {
          attributes: ["id", "name", "dueDate"],
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
          subQuery: false,
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("handles complex filters", () => {
      const options = buildFindOptions(
        hatchify,
        User,
        "include=parent,todos&filter[name]=Justin&filter[todos.importance]=1&filter[parent.parent.name]=John",
        1,
      )

      expect(options).toEqual({
        data: {
          where: {
            [Op.and]: [
              {
                [Op.and]: [
                  { "$User.name$": { [Op.eq]: "Justin" } },
                  { "$todos.importance$": { [Op.eq]: 1 } },
                ],
              },
              {
                "$parent.parent.name$": { [Op.eq]: "John" },
              },
            ],
          },
          include: [
            { association: "parent", include: [] },
            { association: "todos", include: [] },
          ],
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
        buildFindOptions(hatchify, Todo, "fields[]=invalid"),
      ).rejects.toEqualErrors([
        new UnexpectedValueError({
          detail: `URL must have 'fields[]' as comma separated values containing one or more of 'name', 'dueDate', 'importance', 'userId'.`,
          parameter: `fields[]`,
        }),
      ])
    })

    it("handles unknown filter fields", async () => {
      await expect(async () =>
        buildFindOptions(hatchify, Todo, "filter[namee][]=test"),
      ).rejects.toEqualErrors([
        new UnexpectedValueError({
          detail: `URL must have 'filter[x]' where 'x' is one of 'name', 'dueDate', 'importance', 'userId'.`,
          parameter: "filter[namee]",
        }),
      ])
    })

    it("handles unknown relationships", async () => {
      await expect(async () =>
        buildFindOptions(hatchify, Todo, "filter[invalid.name]=invalid"),
      ).rejects.toEqualErrors([
        new UnexpectedValueError({
          detail: `URL must have 'filter[invalid.name]' where 'invalid' is one of the includes.`,
          parameter: `filter[invalid.name]`,
        }),
      ])
    })

    it("handles unknown sort fields", async () => {
      await expect(async () =>
        buildFindOptions(hatchify, Todo, "sort=invalid"),
      ).rejects.toEqualErrors([
        new UnexpectedValueError({
          detail: `URL must have 'sort' as comma separated values containing one or more of 'name', 'dueDate', 'importance', 'userId'.`,
          parameter: `sort`,
        }),
      ])
    })

    it("handles unknown sort assocations", async () => {
      await expect(async () =>
        buildFindOptions(hatchify, Todo, "sort=invalid.alsoinvalid"),
      ).rejects.toEqualErrors([
        new UnexpectedValueError({
          detail: `URL must have 'sort' as comma separated values containing one or more attributes of 'user'.`,
          parameter: `sort`,
        }),
      ])

      await expect(async () =>
        buildFindOptions(
          hatchify,
          DisconnectedSchema,
          "sort=invalid.alsoinvalid",
        ),
      ).rejects.toEqualErrors([
        new UnexpectedValueError({
          detail: `URL must have 'sort' as comma separated values containing one or more attributes of DisconnectedSchema.`,
          parameter: `sort`,
        }),
      ])
    })

    it("handles invalid query string", async () => {
      await expect(async () =>
        buildFindOptions(hatchify, Todo, "fields=name,dueDate"),
      ).rejects.toEqualErrors([
        new UnexpectedValueError({
          detail: "Incorrect format was provided for fields.",
          parameter: "fields",
        }),
      ])
    })
  })

  describe("buildCreateOptions", () => {
    it("works with ID attribute provided", () => {
      const options = buildCreateOptions(
        "include=user&filter[name]=laundry&fields[]=id,name,dueDate&fields[user]=name&page[number]=3&page[size]=5",
      )

      expect(options).toEqual({
        data: {
          attributes: ["id", "name", "dueDate"],
          include: [{ association: "user", include: [], attributes: ["name"] }],
          limit: 5,
          offset: 10,
          subQuery: false,
          where: { name: { [Op.eq]: "laundry" } },
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("handles invalid query string", () => {
      const options = buildCreateOptions("fields=name,dueDate")

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
        "include=user&filter[name]=laundry&fields[]=id,name,dueDate&fields[user]=name&page[number]=3&page[size]=5",
      )

      expect(options).toEqual({
        data: {
          attributes: ["id", "name", "dueDate"],
          include: [{ association: "user", include: [], attributes: ["name"] }],
          limit: 5,
          offset: 10,
          subQuery: false,
          where: { name: { [Op.eq]: "laundry" } },
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("does not add ID attribute if not specified", () => {
      const options = buildUpdateOptions("fields[]=name,dueDate")

      expect(options).toEqual({
        data: {
          attributes: ["name", "dueDate"],
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
          subQuery: false,
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
      const options = buildUpdateOptions("fields[]=invalid")

      expect(options).toEqual({
        data: { attributes: ["invalid"], where: {} },
        errors: [],
        orm: "sequelize",
      })
    })

    it("handles invalid query string", async () => {
      await expect(async () =>
        buildUpdateOptions("fields=name,dueDate"),
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
        "include=user&filter[name]=laundry&fields[]=id,name,dueDate&fields[user]=name&page[number]=3&page[size]=5",
      )

      expect(options).toEqual({
        data: {
          attributes: ["id", "name", "dueDate"],
          include: [{ association: "user", include: [], attributes: ["name"] }],
          limit: 5,
          offset: 10,
          subQuery: false,
          where: { name: { [Op.eq]: "laundry" } },
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("does not add ID attribute if not specified", () => {
      const options = buildDestroyOptions("fields[]=name,dueDate")

      expect(options).toEqual({
        data: {
          attributes: ["name", "dueDate"],
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
          subQuery: false,
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
      const options = buildDestroyOptions("fields[]=invalid")

      expect(options).toEqual({
        data: { attributes: ["invalid"], where: {} },
        errors: [],
        orm: "sequelize",
      })
    })

    it("handles invalid query string", async () => {
      await expect(async () =>
        buildDestroyOptions("fields=name,dueDate"),
      ).rejects.toEqualErrors([
        new UnexpectedValueError({
          detail: "Incorrect format was provided for fields.",
          parameter: "fields",
        }),
      ])
    })
  })
})
