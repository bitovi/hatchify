import { describe, expect, it } from "vitest"
import type { MetaError, MetaLoading, MetaSuccess } from "../types"
import { getMeta } from "./meta"

describe("rest-client/services/utils/meta", () => {
  describe("getMeta", () => {
    it("correctly returns MetaLoading", () => {
      const expected: MetaLoading = {
        status: "loading",
        error: undefined,
        isResolved: false,
        isPending: true,
        isRejected: false,
        isRevalidating: false,
        isStale: false,
        isSuccess: false,
      }

      expect(getMeta(undefined, true, false, undefined)).toEqual(expected)
    })
    it("correctly returns MetaSuccess", () => {
      const expected: MetaSuccess = {
        status: "success",
        error: undefined,
        isResolved: true,
        isPending: false,
        isRejected: false,
        isRevalidating: false,
        isStale: false,
        isSuccess: true,
      }

      expect(getMeta(undefined, false, false, undefined)).toEqual(expected)
    })
    it("correctly returns MetaError", () => {
      const error = {} as MetaError
      const expected = {
        status: "error",
        error,
        isResolved: true,
        isPending: false,
        isRejected: true,
        isRevalidating: false,
        isStale: false,
        isSuccess: false,
      }

      expect(getMeta(error, false, false, undefined)).toEqual(expected)
    })
  })
})
