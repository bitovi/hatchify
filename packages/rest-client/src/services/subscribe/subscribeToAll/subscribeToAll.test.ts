import { describe, it, expect, vi } from "vitest"
import { createStore } from "../../store"
import { subscribeToAll } from "./subscribeToAll"

describe("rest-client/services/subscribe/subscribeToAll", () => {
  it("callback should be called from store subscribers", () => {
    const store = createStore(["articles"])
    const spy = vi.fn()

    subscribeToAll("articles", spy)
    store.articles.subscribers.forEach((fn) => fn([]))

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
