export const addVirtuals = function ({
  queryOptions,
  scaffold,
  modelName,
  all = false,
}) {
  const virtualsForModel = scaffold.virtuals[modelName]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let options: any = {
    include: [],
  }
  if (queryOptions) {
    if (!queryOptions.attributes) {
      options.include = all ? { all: true } : []
    } else {
      queryOptions.attributes.forEach((attribute) => {
        if (
          virtualsForModel &&
          virtualsForModel[attribute] &&
          virtualsForModel[attribute] !== ""
        ) {
          options.include.push(
            ...options.include,
            ...virtualsForModel[attribute],
          )
        }
      })

      if (queryOptions.include) {
        if (Array.isArray(queryOptions.include)) {
          options.include.push(...queryOptions.include)
        } else {
          options.include.push(queryOptions.include)
        }

        delete queryOptions.include
      }
    }

    options = Object.assign(options, queryOptions)
  } else {
    options.include = all ? { all: true } : []
  }

  options.include.length < 1 && delete options.include

  return options
}
