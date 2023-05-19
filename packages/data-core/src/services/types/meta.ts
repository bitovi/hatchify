export type MetaData = any // todo + pagination goes here
export type Error = any // todo

export type Meta = MetaLoading | MetaSuccess | MetaError

// * isDone: no more network requests: true if status is "success" or "error"
// * isLoading: network request in progress: true if status is "loading"
// * isRejected: network request failed: true if status is "error"
// * isRevalidating: network request in progress and data is stale: true if status is "loading" and isStale is true
// * isStale: data is stale: true if status is "loading" or "error"
// * isSuccess: network request succeeded: true if status is "success"

export interface MetaLoading {
  status: "loading"
  meta?: MetaData
  error: undefined

  isDone: false
  isLoading: true
  isRejected: false
  isRevalidating: boolean
  isStale: boolean
  isSuccess: false
}
export interface MetaSuccess {
  status: "success"
  meta?: MetaData
  error: undefined

  isDone: true
  isLoading: false
  isRejected: false
  isRevalidating: false
  isStale: false
  isSuccess: true
}
export interface MetaError {
  status: "error"
  meta?: MetaData
  error: Error

  isDone: true
  isLoading: false
  isRejected: true
  isRevalidating: false
  isStale: boolean
  isSuccess: false
}
