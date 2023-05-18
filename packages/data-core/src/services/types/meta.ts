export type MetaData = { meta: string } // @todo + pagination goes here
export type Error = { message: string } // @todo

export type Meta = MetaLoading | MetaSuccess | MetaError

// * isDone: ONLY if status is "success" or "error"
// * isLoading: ONLY if status is "loading"
// * isRejected: ONLY if status is "error"
// * isRevalidating: ONLY if status is "loading" and isStale is true
// * isStale: ONLY if status is "loading" and there is data (outside of Meta type)
//      * can isStale be true if there is no data? i don't think so
//      * can isStale be true if status is "success" or "error"?
//         * i don't think so - if there is stale data it _should_ be refetched and status should be "loading"

export interface MetaLoading {
  status: "loading"
  meta?: MetaData
  error: never

  isDone: false
  isLoading: true
  isRejected: false
  isRevalidating: boolean
  isStale: boolean
}
export interface MetaSuccess {
  status: "success"
  meta?: MetaData
  error: never

  isDone: true
  isLoading: false
  isRejected: false
  isRevalidating: false
  isStale: false // ? never?
}
export interface MetaError {
  status: "error"
  meta?: MetaData
  error: Error

  isDone: false
  isLoading: false
  isRejected: true
  isRevalidating: false // ? false? never?
  isStale: boolean // ? boolean? never?
}

// export interface MetaRevalidating {
//   status: "loading"
//   meta?: MetaData
//   error: never

//   isDone: false
//   isLoading: true
//   isRejected: false
//   isRevalidating: true
//   isStale: true
// }
