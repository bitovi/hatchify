function getCrypto() {
  return typeof process === "object" &&
    {}.toString.call(process) === "[object process]"
    ? require("crypto")
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
