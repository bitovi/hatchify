import { finalizeOrm } from "./finalizeOrm"

describe("finalizeOrm", () => {
  it("handles allowNull", () => {
    expect(
      finalizeOrm({
        sequelize: {
          type: "Number",
          typeArgs: [],
          allowNull: undefined,
          validate: {},
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "Number",
          typeArgs: [],
          allowNull: null as unknown as boolean,
          validate: {},
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "Number",
          typeArgs: [],
          allowNull: true,
          validate: {},
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "Number",
          typeArgs: [],
          allowNull: false,
          validate: {},
        },
      }).sequelize.allowNull,
    ).toBe(false)
  })

  it("handles primaryKey", () => {
    expect(
      finalizeOrm({
        sequelize: {
          type: "Number",
          typeArgs: [],
          primaryKey: undefined,
          validate: {},
        },
      }).sequelize.primaryKey,
    ).toBe(false)
    expect(
      finalizeOrm({
        sequelize: {
          type: "Number",
          typeArgs: [],
          primaryKey: null as unknown as boolean,
          validate: {},
        },
      }).sequelize.primaryKey,
    ).toBe(false)
    expect(
      finalizeOrm({
        sequelize: {
          type: "Number",
          typeArgs: [],
          primaryKey: true,
          validate: {},
        },
      }).sequelize.primaryKey,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "Number",
          typeArgs: [],
          primaryKey: false,
          validate: {},
        },
      }).sequelize.primaryKey,
    ).toBe(false)
  })

  describe("handles validate", () => {
    it("handles min", () => {
      expect(
        finalizeOrm({
          sequelize: {
            type: "Number",
            typeArgs: [],
            validate: { min: undefined, max: 0 },
          },
        }).sequelize.validate?.min,
      ).toBeUndefined()
      expect(
        finalizeOrm({
          sequelize: {
            type: "Number",
            typeArgs: [],
            validate: { min: null as unknown as number, max: 0 },
          },
        }).sequelize.validate?.min,
      ).toBeUndefined()
      expect(
        finalizeOrm({
          sequelize: {
            type: "Number",
            typeArgs: [],
            validate: { min: 0, max: 0 },
          },
        }).sequelize.validate?.min,
      ).toBe(0)
    })

    it("handles max", () => {
      expect(
        finalizeOrm({
          sequelize: {
            type: "Number",
            typeArgs: [],
            validate: { min: 0, max: undefined },
          },
        }).sequelize.validate?.max,
      ).toBeUndefined()
      expect(
        finalizeOrm({
          sequelize: {
            type: "Number",
            typeArgs: [],
            validate: { min: 0, max: null as unknown as number },
          },
        }).sequelize.validate?.max,
      ).toBeUndefined()
      expect(
        finalizeOrm({
          sequelize: {
            type: "Number",
            typeArgs: [],
            validate: { min: 0, max: 0 },
          },
        }).sequelize.validate?.max,
      ).toBe(0)
    })
  })
})
