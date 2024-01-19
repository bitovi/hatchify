import type { PartialUISchemas } from "./mergeSchemaUI.js"
import { mergeSchemaUI } from "./mergeSchemaUI.js"
import { boolean, string } from "../dataTypes/index.js"
import type { PartialSchema } from "../types/index.js"

describe("mergeSchemaUI", () => {
  it("works", () => {
    const partialSchemas = {
      Todo: {
        name: "Todo",
        attributes: {
          name: string(),
          done: boolean(),
        },
      },
      User: {
        name: "User",
        attributes: {
          name: string(),
        },
      },
    } satisfies Record<string, PartialSchema>

    const partialSchemaUis = {
      Todo: {
        ui: { displayAttribute: "name" },
        attributes: {
          name: {
            control: {
              ui: { displayName: "NAME!", maxDisplayLength: 10 },
            },
          },
          done: {
            control: {
              ui: { displayName: "DONE?" },
            },
          },
        },
      },
    } satisfies PartialUISchemas<typeof partialSchemas>

    expect(mergeSchemaUI(partialSchemas, partialSchemaUis)).toEqual({
      Todo: {
        name: "Todo",
        ui: {
          displayAttribute: "name",
        },
        attributes: {
          name: {
            name: "string()",
            orm: expect.any(Object),
            control: {
              type: "String",
              min: undefined,
              max: undefined,
              primary: undefined,
              ui: { displayName: "NAME!", maxDisplayLength: 10 },
            },
            finalize: expect.any(Function),
          },
          done: {
            name: "boolean()",
            orm: expect.any(Object),
            control: {
              type: "Boolean",
              ui: { displayName: "DONE?" },
            },
            finalize: expect.any(Function),
          },
        },
      },
      User: {
        name: "User",
        attributes: {
          name: {
            name: "string()",
            orm: expect.any(Object),
            control: {
              type: "String",
              min: undefined,
              max: undefined,
              primary: undefined,
              ui: {},
            },
            finalize: expect.any(Function),
          },
        },
      },
    })
  })

  it("ignores non-existent schemas and attributes", () => {
    const partialSchemas = {
      Todo: {
        name: "Todo",
        attributes: {
          name: string(),
          done: boolean(),
        },
      },
      User: {
        name: "User",
        attributes: {
          name: string(),
        },
      },
    } satisfies Record<string, PartialSchema>

    const partialSchemaUis = {
      Todos: {
        attributes: {
          name: {
            control: {
              ui: { displayName: "NAME!", maxDisplayLength: undefined },
            },
          },
          done: {
            control: {
              ui: { displayName: "DONE?" },
            },
          },
        },
      },
      User: {
        ui: { displayAttribute: "name" },
        attributes: {
          fullName: {
            control: {
              ui: { displayName: "FULL NAME" },
            },
          },
        },
      },
    } as unknown as PartialUISchemas<typeof partialSchemas>

    expect(mergeSchemaUI(partialSchemas, partialSchemaUis)).toEqual({
      Todo: {
        name: "Todo",
        attributes: {
          name: {
            name: "string()",
            orm: expect.any(Object),
            control: {
              type: "String",
              min: undefined,
              max: undefined,
              primary: undefined,
              ui: {},
            },
            finalize: expect.any(Function),
          },
          done: {
            name: "boolean()",
            orm: expect.any(Object),
            control: {
              type: "Boolean",
              ui: {},
            },
            finalize: expect.any(Function),
          },
        },
      },
      User: {
        name: "User",
        ui: { displayAttribute: "name" },
        attributes: {
          name: {
            name: "string()",
            orm: expect.any(Object),
            control: {
              type: "String",
              min: undefined,
              max: undefined,
              primary: undefined,
              ui: {},
            },
            finalize: expect.any(Function),
          },
        },
      },
    })
  })
})
