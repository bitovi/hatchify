describe("getCrypto", () => {
  it("returns window.crypto if available", async () => {
    Object.defineProperty(globalThis, "crypto", {
      value: "window.crypto",
    })
    const { getCrypto } = await import("./uuidv4.js")
    expect(getCrypto()).toBe("window.crypto")
  })
})
