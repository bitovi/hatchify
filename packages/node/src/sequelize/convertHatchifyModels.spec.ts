import { integer } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"
import JSONAPISerializer from "json-api-serializer"

import { convertHatchifyModels } from "./convertHatchifyModels"
import { createSequelizeInstance } from "./createSequelizeInstance"

describe("convertHatchifyModels", () => {
  const sequelize = createSequelizeInstance()
  const serializer = new JSONAPISerializer()

  const User: PartialSchema = {
    name: "User",
    attributes: {
      age: integer({ min: 0 }),
    },
  }

  it("works", () => {
    const models = convertHatchifyModels(sequelize, serializer, { User })

    expect(models).toEqual({
      associationsLookup: { User: {} },
      sequelizeModels: {
        User: expect.any(Function),
      },
    })
  })
})
