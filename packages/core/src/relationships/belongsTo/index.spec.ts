import { belongsTo } from "./index.js"

describe("belongsTo", () => {
  it("belongsTo()", () => {
    expect(belongsTo()).toEqual({
      type: "belongsTo",
      targetSchema: null,
      sourceAttribute: null,
      targetAttribute: null,
    })
  })

  it("belongsTo(schemaName)", () => {
    expect(belongsTo("SalesPerson")).toEqual({
      type: "belongsTo",
      targetSchema: "SalesPerson",
      sourceAttribute: null,
      targetAttribute: null,
    })
  })

  it("belongsTo(schemaName, {sourceAttribute})", () => {
    expect(belongsTo("SalesPerson", { sourceAttribute: "finisherId" })).toEqual(
      {
        type: "belongsTo",
        targetSchema: "SalesPerson",
        sourceAttribute: "finisherId",
        targetAttribute: null,
      },
    )
  })
})
