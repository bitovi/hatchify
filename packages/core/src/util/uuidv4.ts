export function getCrypto() {
  return globalThis.crypto
}

export function uuidv4(): string {
  return globalThis.crypto.randomUUID()
}
