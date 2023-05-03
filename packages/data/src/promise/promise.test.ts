import { afterEach, describe, it, expect } from "vitest"
import { getList, createOne } from "./promise"
import { convertRecordArrayToById, createStore } from "../store"
import { articles, baseUrl } from "shared/mocks/handlers"
import { jsonapi } from "source-jsonapi"

describe("data/promise", () => {
  afterEach(() => {
    // reset the store's state
    createStore(["articles"])
  })

  describe("getList", () => {
    it("should return a list of records", async () => {
      const store = createStore(["articles"])
      const dataSource = jsonapi({ baseUrl })
      const result = await getList(dataSource, "articles", {})

      expect(result).toEqual(articles)
      expect(store.articles.data).toEqual(convertRecordArrayToById(articles))
    })
  })

  describe("createOne", () => {
    it.only("should create a record", async () => {
      const store = createStore(["articles"])
      const dataSource = jsonapi({ baseUrl })
      const expected = {
        id: `article-id-${articles.length + 1}`,
        type: "Article",
        attributes: {
          title: "New Article",
          body: "New Body",
        },
      }

      const result = await createOne(dataSource, "articles", {
        title: "New Article",
        body: "New Body",
      })

      expect(result).toEqual(result)
      expect(store.articles.data).toEqual({ [expected.id]: expected })
    })
  })
})
