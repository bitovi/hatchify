function toPojo(error: Error) {
  return Object.entries(error).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {},
  )
}

expect.extend({
  toEqualErrors(actual, expected) {
    const actualPojos = actual.map(toPojo)
    const expectedPojos = expected.map(toPojo)
    const stringifiedActual = JSON.stringify(actualPojos)
    const stringifiedExpected = JSON.stringify(expectedPojos)
    const pass = stringifiedActual === stringifiedExpected

    return {
      pass,
      message: pass
        ? () =>
            `expected ${stringifiedActual} not to equal ${stringifiedExpected}`
        : () => `expected ${stringifiedActual} to equal ${stringifiedExpected}`,
    }
  },
})

export {}
