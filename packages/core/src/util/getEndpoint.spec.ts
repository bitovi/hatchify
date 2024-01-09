import { getEndpoint } from "./getEndpoint.js"

describe("getEndpoint", () => {
  describe("without namespaces", () => {
    it("should use pluralName if exists", () => {
      expect(
        getEndpoint({
          name: "SalesPerson",
          pluralName: "SalesPeople",
        }),
      ).toBe("sales-people")
    })

    it("should append s if pluralName does not exist", () => {
      expect(
        getEndpoint({
          name: "SalesPerson",
        }),
      ).toBe("sales-persons")
    })
  })

  describe("with namespaces", () => {
    it("should use pluralName if exists", () => {
      expect(
        getEndpoint({
          name: "SalesPerson",
          pluralName: "SalesPeople",
          namespace: "Accounting",
        }),
      ).toBe("accounting/sales-people")
    })

    it("should append s if pluralName does not exist", () => {
      expect(
        getEndpoint({
          name: "SalesPerson",
          namespace: "Accounting",
        }),
      ).toBe("accounting/sales-persons")
    })
  })
})
