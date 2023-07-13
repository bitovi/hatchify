type OwnMatcher<Params extends unknown[]> = (
  this: jest.MatcherContext,
  actual: Error[],
  ...params: Params
) => jest.CustomMatcherResult

declare global {
  namespace jest {
    interface ExpectExtendMap {
      // A helper for comparing errors array. `toEqual` always returns `true`
      toEqualErrors: OwnMatcher<[errors: Error[]]>
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Matchers<R, T> {
      toEqualErrors(errors: Error[]): T
    }
  }
}

export {}
