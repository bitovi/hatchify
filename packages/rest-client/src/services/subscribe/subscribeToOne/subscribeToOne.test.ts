import { describe, it, expect, vi } from "vitest"
import { createStore } from "../../store/index.js"
import { subscribeToOne } from "./subscribeToOne.js"

// todo: individual subscribes not used at the moment
describe.skip("rest-client/services/subscribesubscribeToOne", () => {
  it("callback should be called from store subscribers", () => {
    const store = createStore(["articles"])
    const spy = vi.fn()
    subscribeToOne("articles", "article-1", spy)

    store.articles.subscribers.forEach((fn) => fn([]))

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it("should not call callback if id does not exist in data", () => {
    const store = createStore(["articles"])
    const spy = vi.fn()
    subscribeToOne("articles", "article-1", spy)

    store.articles.subscribers.forEach((fn) => fn([]))

    expect(spy).not.toHaveBeenCalled()
  })
})
