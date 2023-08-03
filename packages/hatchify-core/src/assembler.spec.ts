import { assembler } from "./assembler"
import { integer } from "./dataTypes"
import type { HatchifyInteger } from "./dataTypes/integer"
import type { SchemaV2 } from "./types"

describe("assembler", () => {
  const Todo: SchemaV2 = {
    name: "Todo",
    id: integer({ required: true, autoIncrement: true }),
    attributes: {
      importance: integer({ min: 0 }),
    },
  }

  it("injects primary key", () => {
    const preparedId = (Todo.id as HatchifyInteger).prepare()

    expect(preparedId.controlType.primary).toBeFalsy()
    expect(preparedId.orm.sequelize.primaryKey).toBeFalsy()

    const { Todo: assembledTodo } = assembler({ Todo })
    const assembledId = assembledTodo.id as HatchifyInteger
    const preparedAssembledId = assembledId.prepare()

    expect(preparedAssembledId.controlType.primary).toBe(true)
    expect(preparedAssembledId.orm.sequelize.primaryKey).toBe(true)
  })
})
