// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getCrypto() {
  return typeof window === "undefined"
    ? // eslint-disable-next-line @typescript-eslint/no-var-requires
      require("node:crypto").webcrypto
    : window.crypto
}

export function uuidv4(): string {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (getCrypto().getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16),
  )
}
