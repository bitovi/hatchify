import { describe, it, expect, vi } from "vitest"
import { subscribeToList, subscribeToOne } from "./subscribe"
import { createStore } from "../store"

describe("data-core/subscribe", () => {
  describe("subscribeToList", () => {
    it("callback should be called from store subscribers", () => {
      const store = createStore(["articles"])
      const spy = vi.fn()

      subscribeToList("articles", spy)
      store.articles.subscribers.forEach((fn) => fn([]))

      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  describe("subscribeToOne", () => {
    it("callback should be called from store subscribers", () => {
      const store = createStore(["articles"])
      const spy = vi.fn()
      subscribeToOne("articles", spy, "article-1")

      store.articles.subscribers.forEach((fn) =>
        fn([{ id: "article-1", attributes: {} }]),
      )

      expect(spy).toHaveBeenCalledTimes(1)
    })

    it("should not call callback if id does not exist in data", () => {
      const store = createStore(["articles"])
      const spy = vi.fn()
      subscribeToOne("articles", spy, "article-1")

      store.articles.subscribers.forEach((fn) =>
        fn([{ id: "article-2", attributes: {} }]),
      )

      expect(spy).not.toHaveBeenCalled()
    })
  })
})
