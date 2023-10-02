import { hasOne } from "."

describe("hasOne", () => {
  it("hasOne()", () => {
    expect(hasOne()).toEqual({
      type: "hasOne",
      targetSchema: null,
      targetAttribute: null,
      sourceAttribute: null,
    })
  })

  it("hasOne(schemaName)", () => {
    expect(hasOne("SalesPerson")).toEqual({
      type: "hasOne",
      targetSchema: "SalesPerson",
      targetAttribute: null,
      sourceAttribute: null,
    })
  })

  it("hasOne(schemaName, {targetAttribute})", () => {
    expect(hasOne("SalesPerson", { targetAttribute: "salesId" })).toEqual({
      type: "hasOne",
      targetSchema: "SalesPerson",
      targetAttribute: "salesId",
      sourceAttribute: null,
    })
  })
})
