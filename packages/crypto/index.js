import crypto from "node:crypto"

export function getCrypto() {
  return crypto.webcrypto
}

export function uuidv4() {
  return crypto.webcrypto.randomUUID()
}
