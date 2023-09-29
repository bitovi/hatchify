import { buildThrough } from "./buildThrough"

describe("buildThrough", () => {
  it("accepts null targetSchema", () => {
    const through = buildThrough(null)
    expect(through()).toEqual({
      type: "hasManyThrough",
      targetSchema: null,
      through: null,
      throughTargetAttribute: null,
      throughSourceAttribute: null,
    })
  })

  it("accepts targetSchema", () => {
    const through = buildThrough("Commission")
    expect(through()).toEqual({
      type: "hasManyThrough",
      targetSchema: "Commission",
      through: null,
      throughTargetAttribute: null,
      throughSourceAttribute: null,
    })
  })

  it("accepts throughSourceAttribute and throughTargetAttribute", () => {
    const through = buildThrough("Commission")
    expect(
      through({
        throughTargetAttribute: "theAccountId",
        throughSourceAttribute: "sellerId",
      }),
    ).toEqual({
      type: "hasManyThrough",
      targetSchema: "Commission",
      through: null,
      throughTargetAttribute: "theAccountId",
      throughSourceAttribute: "sellerId",
    })
  })

  it("accepts sourceKey and targetKey", () => {
    const through = buildThrough("Commission")
    expect(
      through({
        targetKey: "accountSaleTypeId",
        sourceKey: "sellerTypeId",
      }),
    ).toEqual({
      type: "hasManyThrough",
      targetSchema: "Commission",
      through: null,
      throughTargetAttribute: null,
      throughSourceAttribute: null,
      targetKey: "accountSaleTypeId",
      sourceKey: "sellerTypeId",
    })
  })
})
