import type { FindOptions } from "sequelize"
import { Op } from "sequelize"

import type { QueryStringParser } from "./builder.js"
import { handleSqliteLike } from "./handleSqliteLike.js"

describe("handleSqliteLike", () => {
  const likeQuery: QueryStringParser<FindOptions> = {
    data: {
      where: { "$User.name$": { [Op.like]: "test%" } },
    },
    errors: [],
    orm: "sequelize",
  }
  const likeAnyQuery: QueryStringParser<FindOptions> = {
    data: {
      where: { "$User.name$": { [Op.like]: { [Op.any]: ["test", "foo"] } } },
    },
    errors: [],
    orm: "sequelize",
  }
  const iLikeQuery: QueryStringParser<FindOptions> = {
    data: {
      where: { "$User.name$": { [Op.iLike]: "test" } },
    },
    errors: [],
    orm: "sequelize",
  }
  const iLikeAnyQuery: QueryStringParser<FindOptions> = {
    data: {
      where: { "$User.name$": { [Op.iLike]: { [Op.any]: ["test", "foo"] } } },
    },
    errors: [],
    orm: "sequelize",
  }

  const nonSqliteTestList: Array<[string, QueryStringParser<FindOptions>]> = [
    ["LIKE", likeQuery],
    ["LIKE ANY", likeAnyQuery],
    ["ILIKE", iLikeQuery],
    ["ILIKE ANY", iLikeAnyQuery],
  ]

  describe("non-sqlite dialects", () => {
    it.each(nonSqliteTestList)("does not convert %s", (op, query) => {
      expect(handleSqliteLike(query, "postgres")).toEqual(query)
    })
  })

  describe("with sqlite dialect", () => {
    it("does not convert LIKE", async () => {
      expect(handleSqliteLike(likeQuery, "sqlite")).toEqual(likeQuery)
    })

    it("converts LIKE ANY", async () => {
      expect(handleSqliteLike(likeAnyQuery, "sqlite")).toEqual({
        data: {
          where: {
            "$User.name$": {
              [Op.or]: [{ [Op.like]: "test" }, { [Op.like]: "foo" }],
            },
          },
        },
        errors: [],
        orm: "sequelize",
      })
    })

    it("converts ILIKE", async () => {
      expect(handleSqliteLike(iLikeQuery, "sqlite")).toEqual({
        data: {
          where: {
            [Op.and]: [
              {
                attribute: {
                  args: [
                    {
                      col: "`User.name`",
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
      expect(handleSqliteLike(iLikeAnyQuery, "sqlite")).toEqual({
        data: {
          where: {
            [Op.or]: [
              {
                attribute: {
                  args: [
                    {
                      col: "`User.name`",
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
                      col: "`User.name`",
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
})
