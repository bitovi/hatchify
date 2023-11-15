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
    const through = buildThrough("Account")
    expect(through()).toEqual({
      type: "hasManyThrough",
      targetSchema: "Account",
      through: null,
      throughTargetAttribute: null,
      throughSourceAttribute: null,
    })
  })

  it("accepts through", () => {
    const through = buildThrough(null)
    expect(through("Commission")).toEqual({
      type: "hasManyThrough",
      targetSchema: null,
      through: "Commission",
      throughTargetAttribute: null,
      throughSourceAttribute: null,
    })
  })

  it("accepts throughSourceAttribute and throughTargetAttribute", () => {
    const through = buildThrough("Account")
    expect(
      through(null, {
        throughTargetAttribute: "theAccountId",
        throughSourceAttribute: "sellerId",
      }),
    ).toEqual({
      type: "hasManyThrough",
      targetSchema: "Account",
      through: null,
      throughTargetAttribute: "theAccountId",
      throughSourceAttribute: "sellerId",
    })
  })

  it("accepts through, throughSourceAttribute and throughTargetAttribute", () => {
    const through = buildThrough("Account")
    expect(
      through("Commission", {
        throughTargetAttribute: "theAccountId",
        throughSourceAttribute: "sellerId",
      }),
    ).toEqual({
      type: "hasManyThrough",
      targetSchema: "Account",
      through: "Commission",
      throughTargetAttribute: "theAccountId",
      throughSourceAttribute: "sellerId",
    })
  })

  it("accepts sourceKey and targetKey", () => {
    const through = buildThrough("Account")
    expect(
      through(null, {
        targetKey: "accountSaleTypeId",
        sourceKey: "sellerTypeId",
      }),
    ).toEqual({
      type: "hasManyThrough",
      targetSchema: "Account",
      through: null,
      throughTargetAttribute: null,
      throughSourceAttribute: null,
      targetKey: "accountSaleTypeId",
      sourceKey: "sellerTypeId",
    })
  })

  it("accepts through, sourceKey and targetKey", () => {
    const through = buildThrough("Account")
    expect(
      through("Commission", {
        targetKey: "accountSaleTypeId",
        sourceKey: "sellerTypeId",
      }),
    ).toEqual({
      type: "hasManyThrough",
      targetSchema: "Account",
      through: "Commission",
      throughTargetAttribute: null,
      throughSourceAttribute: null,
      targetKey: "accountSaleTypeId",
      sourceKey: "sellerTypeId",
    })
  })
})
