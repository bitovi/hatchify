import { hasMany } from "./index.js"

describe("hasMany", () => {
  it("hasMany()", () => {
    const relationship = hasMany()

    expect(relationship).toEqual({
      type: "hasMany",
      targetSchema: null,
      targetAttribute: null,
      sourceAttribute: null,
      through: expect.any(Function),
    })

    expect(relationship.through?.()).toEqual({
      type: "hasManyThrough",
      targetSchema: null,
      through: null,
      throughTargetAttribute: null,
      throughSourceAttribute: null,
    })

    expect(relationship.through?.("Commission")).toEqual({
      type: "hasManyThrough",
      targetSchema: null,
      through: "Commission",
      throughTargetAttribute: null,
      throughSourceAttribute: null,
    })

    expect(
      relationship.through?.(null, {
        throughTargetAttribute: "theAccountId",
        throughSourceAttribute: "sellerId",
      }),
    ).toEqual({
      type: "hasManyThrough",
      targetSchema: null,
      through: null,
      throughTargetAttribute: "theAccountId",
      throughSourceAttribute: "sellerId",
    })

    expect(
      relationship.through?.("Commission", {
        throughTargetAttribute: "theAccountId",
        throughSourceAttribute: "sellerId",
      }),
    ).toEqual({
      type: "hasManyThrough",
      targetSchema: null,
      through: "Commission",
      throughTargetAttribute: "theAccountId",
      throughSourceAttribute: "sellerId",
    })

    expect(
      relationship.through?.(null, {
        targetKey: "accountSaleTypeId",
        sourceKey: "sellerTypeId",
      }),
    ).toEqual({
      type: "hasManyThrough",
      targetSchema: null,
      through: null,
      throughTargetAttribute: null,
      throughSourceAttribute: null,
      targetKey: "accountSaleTypeId",
      sourceKey: "sellerTypeId",
    })

    expect(
      relationship.through?.("Commission", {
        targetKey: "accountSaleTypeId",
        sourceKey: "sellerTypeId",
      }),
    ).toEqual({
      type: "hasManyThrough",
      targetSchema: null,
      through: "Commission",
      throughTargetAttribute: null,
      throughSourceAttribute: null,
      targetKey: "accountSaleTypeId",
      sourceKey: "sellerTypeId",
    })
  })

  it("hasMany(schemaName)", () => {
    const relationship = hasMany("SalesPerson")

    expect(relationship).toEqual({
      type: "hasMany",
      targetSchema: "SalesPerson",
      targetAttribute: null,
      sourceAttribute: null,
      through: expect.any(Function),
    })

    expect(relationship.through?.()).toEqual({
      type: "hasManyThrough",
      targetSchema: "SalesPerson",
      through: null,
      throughTargetAttribute: null,
      throughSourceAttribute: null,
    })

    expect(relationship.through?.("Commission")).toEqual({
      type: "hasManyThrough",
      targetSchema: "SalesPerson",
      through: "Commission",
      throughTargetAttribute: null,
      throughSourceAttribute: null,
    })

    expect(
      relationship.through?.(null, {
        throughTargetAttribute: "theAccountId",
        throughSourceAttribute: "sellerId",
      }),
    ).toEqual({
      type: "hasManyThrough",
      targetSchema: "SalesPerson",
      through: null,
      throughTargetAttribute: "theAccountId",
      throughSourceAttribute: "sellerId",
    })

    expect(
      relationship.through?.("Commission", {
        throughTargetAttribute: "theAccountId",
        throughSourceAttribute: "sellerId",
      }),
    ).toEqual({
      type: "hasManyThrough",
      targetSchema: "SalesPerson",
      through: "Commission",
      throughTargetAttribute: "theAccountId",
      throughSourceAttribute: "sellerId",
    })

    expect(
      relationship.through?.(null, {
        targetKey: "accountSaleTypeId",
        sourceKey: "sellerTypeId",
      }),
    ).toEqual({
      type: "hasManyThrough",
      targetSchema: "SalesPerson",
      through: null,
      throughTargetAttribute: null,
      throughSourceAttribute: null,
      targetKey: "accountSaleTypeId",
      sourceKey: "sellerTypeId",
    })

    expect(
      relationship.through?.("Commission", {
        targetKey: "accountSaleTypeId",
        sourceKey: "sellerTypeId",
      }),
    ).toEqual({
      type: "hasManyThrough",
      targetSchema: "SalesPerson",
      through: "Commission",
      throughTargetAttribute: null,
      throughSourceAttribute: null,
      targetKey: "accountSaleTypeId",
      sourceKey: "sellerTypeId",
    })
  })

  it("hasMany(schemaName, {targetAttribute})", () => {
    const relationship = hasMany("SalesPerson", { targetAttribute: "salesId" })

    expect(relationship).toEqual({
      type: "hasMany",
      targetSchema: "SalesPerson",
      targetAttribute: "salesId",
      sourceAttribute: null,
      through: expect.any(Function),
    })
  })
})
