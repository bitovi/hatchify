import { describe, it, expect, vi } from "vitest"
import { createStore } from "../../store/index.js"
import { subscribeToAll } from "./subscribeToAll.js"

describe("rest-client/services/subscribe/subscribeToAll", () => {
  it("callback should be called from store subscribers", () => {
    const store = createStore(["articles"])
    const spy = vi.fn()

    subscribeToAll("articles", undefined, spy)
    store.articles.subscribers.forEach((fn) => fn([]))

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
