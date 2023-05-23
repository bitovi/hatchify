import { describe, it, expect, vi } from "vitest"
import { createStore } from "../../store"
import { subscribeToList } from "./subscribeToList"

describe("rest-client/services/subscribe/subscribeToList", () => {
  it("callback should be called from store subscribers", () => {
    const store = createStore(["articles"])
    const spy = vi.fn()

    subscribeToList("articles", spy)
    store.articles.subscribers.forEach((fn) => fn([]))

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
