import {
  assembler,
  belongsTo,
  datetime,
  hasMany,
  integer,
  string,
} from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"
import { Op } from "sequelize"

import {
  buildCreateOptions,
  buildFindOptions,
  replaceIdentifiers,
} from "./builder.js"
import { RelationshipPathError, UnexpectedValueError } from "../error/index.js"
import { Hatchify } from "../node.js"

describe("builder", () => {
  const UserSchema = {
    name: "User",
    attributes: {
      name: string(),
    },
    relationships: {
      parent: belongsTo("User"),
      todos: hasMany(),
    },
  } satisfies PartialSchema
  const TodoSchema = {
    name: "Todo",
    attributes: {
      name: string(),
      dueDate: datetime(),
      importance: integer(),
    },
    relationships: {
      user: belongsTo(),
    },
  } satisfies PartialSchema
  const DisconnectedSchemaSchema = {
    name: "DisconnectedSchema",
    attributes: {
      name: string(),
      importance: integer(),
    },
  } satisfies PartialSchema
  const hatchify = new Hatchify(
    {
      User: UserSchema,
      Todo: TodoSchema,
      DisconnectedSchema: DisconnectedSchemaSchema,
    },
    { prefix: "/api" },
  )

  const { User, Todo, DisconnectedSchema } = hatchify.schema

  describe("replaceIdentifiers", () => {
    it("replaces schema names with relationship names", async () => {
      const { Employee } = assembler({
        Employee: {
          name: "Employee",
          attributes: {},
          relationships: {
            todos: hasMany("Todo"),
          },
        },
        Todo: {
          name: "Todo",
          attributes: {},
          relationships: {
            employee: belongsTo("Employee"),
          },
        },
      })

      await expect(async () =>
        replaceIdentifiers(
          "fields[Employee]=id,name&fields[Todo]=id,name,dueDate&fields[User]=invalid",
          Employee,
        ),
      ).rejects.toEqualErrors([
        new UnexpectedValueError({
          detail:
            "URL must have 'fields[x]' where 'x' is one of 'Employee', 'Todo'.",
          parameter: "fields[User]",
        }),
      ])
    })

    it("handles fields on main table", async () => {
      const { Employee } = assembler({
        Employee: {
          name: "Employee",
          attributes: {},
          relationships: {
            manager: belongsTo("Employee"),
            colleagues: hasMany("Employee"),
          },
        },
      })

      await expect(async () =>
        replaceIdentifiers(
          "fields[Employee]=id,name,dueDate&fields[User]=invalid",
          Employee,
        ),
      ).rejects.toEqualErrors([
        new UnexpectedValueError({
          detail: "URL must have 'fields[x]' where 'x' is one of 'Employee'.",
          parameter: "fields[User]",
        }),
      ])
    })

    it("handles no fields on main table", () => {
      const { Employee } = assembler({
        Employee: {
          name: "Employee",
          attributes: {},
          relationships: {
            todos: hasMany("Todo"),
          },
        },
        Todo: {
          name: "Todo",
          attributes: {},
          relationships: {
            employee: belongsTo("Employee"),
          },
        },
      })

      expect(
        replaceIdentifiers(
          "fields[Todo]=id,name,dueDate&fields[Employee]=invalid",
          Employee,
        ),
      ).toBe("fields[todos]=id,name,dueDate&fields[]=invalid")
    })
  })

  describe("buildFindOptions", () => {
    it("works with ID attribute provided", () => {
      const options = buildFindOptions(
        hatchify,
        Todo,
        "include=user&filter[name]=laundry&fields[Todo]=id,name,dueDate&fields[User]=name&page[number]=3&page[size]=5&sort=-dueDate,name",
      )

      expect(options).toEqual({
        data: {
          attributes: ["id", "name", "dueDate"],
          include: [{ association: "user", include: [], attributes: ["name"] }],
          distinct: true,
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
      const options = buildFindOptions(
        hatchify,
        Todo,
        "fields[Todo]=name,dueDate",
      )

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
        "include=parent,parent.parent,todos&filter[name]=Justin&filter[todos.importance]=1&filter[parent.parent.name]=John",
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
            {
              association: "parent",
              include: [{ association: "parent", include: [] }],
            },
            { association: "todos", include: [] },
          ],
          distinct: true,
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("handles zero offset with positive limit", async () => {
      expect(
        buildFindOptions(hatchify, Todo, "page[offset]=0&page[limit]=10"),
      ).toEqual({
        data: {
          where: {},
          limit: 10,
          offset: 0,
          subQuery: false,
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
        buildFindOptions(hatchify, Todo, "fields[Todo]=invalid"),
      ).rejects.toEqualErrors([
        new UnexpectedValueError({
          detail: `URL must have 'fields[Todo]' as comma separated values containing one or more of 'name', 'dueDate', 'importance', 'userId'.`,
          parameter: `fields[Todo]`,
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
        new RelationshipPathError({
          detail:
            "URL must have 'include' with 'invalid' as one of the relationships to include.",
          parameter: "include",
        }),
        new RelationshipPathError({
          detail:
            "URL must have 'filter[invalid.name]' where 'invalid.name' is a valid attribute.",
          parameter: "filter[invalid.name]",
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

    it("handles unknown sort associations", async () => {
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
        "include=user&filter[name]=laundry&fields[Todo]=id,name,dueDate&fields[User]=name&page[number]=3&page[size]=5",
        Todo,
      )

      expect(options).toEqual({
        data: {
          attributes: ["id", "name", "dueDate"],
          include: [{ association: "user", include: [], attributes: ["name"] }],
          distinct: true,
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
      const options = buildCreateOptions("fields=name,dueDate", Todo)

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
