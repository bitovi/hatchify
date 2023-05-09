import { describe, it, expect, vi } from "vitest"
import { subscribeToList } from "./subscribe"
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
})
