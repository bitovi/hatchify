import { hasMany } from "."

describe("hasMany", () => {
  it("hasMany()", () => {
    const relationship = hasMany()

    expect(relationship).toEqual({
      type: "hasMany",
      targetSchema: null,
      targetAttribute: null,
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
      relationship.through?.({
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
      relationship.through?.({
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
  })

  it("hasMany(schemaName)", () => {
    const relationship = hasMany("SalesPerson")

    expect(relationship).toEqual({
      type: "hasMany",
      targetSchema: "SalesPerson",
      targetAttribute: null,
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
      relationship.through?.({
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
      relationship.through?.({
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
  })

  it("hasMany(schemaName, {targetAttribute})", () => {
    const relationship = hasMany("SalesPerson", { targetAttribute: "salesId" })

    expect(relationship).toEqual({
      type: "hasMany",
      targetSchema: "SalesPerson",
      targetAttribute: "salesId",
      through: expect.any(Function),
    })
  })
})
