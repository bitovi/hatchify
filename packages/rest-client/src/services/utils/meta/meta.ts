import type { Meta, MetaError } from "../../types"

export function getMeta(
  error: MetaError | undefined,
  loading: boolean,
  isStale: boolean,
  meta: Meta["meta"],
): Meta {
  const status = error ? "error" : loading ? "loading" : "success"

  if (status === "success") {
    return {
      status,
      meta,
      error: undefined,
      isResolved: true,
      isPending: false,
      isRejected: false,
      isRevalidating: false,
      isStale: false,
      isSuccess: true,
    }
  } else if (status === "loading") {
    return {
      status,
      meta,
      error: undefined,
      isResolved: false,
      isPending: true,
      isRejected: false,
      isRevalidating: isStale,
      isStale,
      isSuccess: false,
    }
  } else {
    return {
      status,
      meta,
      error,
      isResolved: true,
      isPending: false,
      isRejected: true,
      isRevalidating: false,
      isStale,
      isSuccess: false,
    }
  }
}
