export const walk: <T>(
  maybeObj: T | any[],
  fn: (key: string | symbol, value: unknown) => void,
) => T | any[] = (maybeObj, fn) => {
  if (Array.isArray(maybeObj)) {
    return maybeObj.map((item) => walk<typeof item>(item, fn))
  } else if (maybeObj && typeof maybeObj === "object") {
    const keys = [
      ...Object.getOwnPropertyNames(maybeObj),
      ...Object.getOwnPropertySymbols(maybeObj),
    ]
    const entries = keys.map((k) => [
      k,
      (maybeObj as { [key: typeof k]: any })[k],
    ])
    return entries.reduce((acc, [key, value]) => {
      const [newVal, newKey = key] =
        (fn(key, value) as unknown as [unknown, string | symbol]) ?? []
      return {
        ...acc,
        [newKey]: newVal ?? walk<typeof value>(value, fn),
      }
    }, {}) as typeof maybeObj
  } else {
    return maybeObj
  }
}
