import { describe, it, expect, vi } from "vitest"
import { createStore } from "../../store"
import { subscribeToOne } from "./subscribeToOne"

describe("rest-client/services/subscribesubscribeToOne", () => {
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
