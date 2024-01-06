/* c8 ignore next */
const crypto = globalThis.crypto || (await import("node:crypto")).webcrypto

export function getCrypto() {
  return crypto
}

export function uuidv4(): string {
  return crypto.randomUUID()
}
