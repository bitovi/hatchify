import { integer } from "@hatchifyjs/hatchify-core"
import type { PartialSchema } from "@hatchifyjs/hatchify-core"
import JSONAPISerializer from "json-api-serializer"

import { convertHatchifyModels } from "./convertHatchifyModels"
import { createSequelizeInstance } from "../createSequelizeInstance"

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
      associationsLookup: {},
      models: {
        User: expect.any(Function),
      },
      virtuals: {},
      plurals: {},
    })
  })
})
