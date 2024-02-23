export type RequestMetaData = Record<string, any> | undefined
export type Error = any // todo

export type Meta = MetaLoading | MetaSuccess | MetaError
export type StatefulMeta = Record<string, Meta>

// * isResolved: no more network requests: true if status is "success" or "error"
// * isPending: network request in progress: true if status is "loading"
// * isRejected: network request failed: true if status is "error"
// * isRevalidating: network request in progress and data is stale: true if status is "loading" and isStale is true
// * isStale: data is stale: true if status is "loading" or "error"
// * isSuccess: network request succeeded: true if status is "success"

export interface MetaLoading {
  status: "loading"
  meta?: RequestMetaData
  error: undefined

  isResolved: false
  isPending: true
  isRejected: false
  isRevalidating: boolean
  isStale: boolean
  isSuccess: false
}
export interface MetaSuccess {
  status: "success"
  meta?: RequestMetaData
  error: undefined

  isResolved: true
  isPending: false
  isRejected: false
  isRevalidating: false
  isStale: false
  isSuccess: true
}
export interface MetaError {
  status: "error"
  meta?: RequestMetaData
  error: Error

  isResolved: true
  isPending: false
  isRejected: true
  isRevalidating: false
  isStale: boolean
  isSuccess: false
}
