import { UUID_REGEX } from "./constants"

import { uuid } from "."

describe("getFinalize", () => {
  it("finalizes a partial attribute", () => {
    expect(uuid()).toEqual({
      name: "uuid()",
      control: {
        hidden: null,
        allowNull: undefined,
        max: 36,
        min: 36,
        primary: undefined,
        regex: UUID_REGEX,
        type: "String",
      },
      orm: {
        sequelize: {
          allowNull: undefined,
          primaryKey: undefined,
          type: "UUID",
        },
      },
      finalize: expect.any(Function),
    })
  })
})
