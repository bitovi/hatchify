describe("getCrypto", () => {
  it("returns window.crypto if available", async () => {
    Object.defineProperty(window, "crypto", {
      value: "window.crypto",
    })
    const { getCrypto } = await import("@hatchifyjs/core/dist/util/uuidv4.js")
    expect(getCrypto()).toBe("window.crypto")
  })
})
