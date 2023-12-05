import { string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/node"

import { startServerWith } from "./testing/utils"

describe("Attribute Tests", () => {
  const Model: PartialSchema = {
    name: "Model",
    attributes: {
      firstName: string({ required: true }),
      lastName: string({ required: true }),
    },
  }

  let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
  let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

  beforeEach(async () => {
    ;({ fetch, teardown } = await startServerWith({ Model }, "sqlite"))
  })

  afterEach(async () => {
    await teardown()
  })

  it("should create a record and fetch specific attributes", async () => {
    const create = await fetch("/api/models", {
      method: "post",
      body: {
        data: {
          type: "Model",
          attributes: {
            firstName: "firstName",
            lastName: "lastName",
          },
        },
      },
    })

    expect(create).toBeTruthy()
    expect(create.status).toBe(200)
    expect(create.body.data).toHaveProperty("id")

    const find1 = await fetch(
      `/api/models/${create.body.data.id}?fields[]=firstName`,
    )

    expect(find1).toBeTruthy()
    expect(find1.status).toBe(200)
    expect(find1.body.data).toBeTruthy()
    expect(find1.body.data.attributes).toHaveProperty("firstName")
    expect(find1.body.data.attributes).not.toHaveProperty("lastName")

    const find2 = await fetch(
      `/api/models/${create.body.data.id}?fields[]=lastName`,
    )

    expect(find2).toBeTruthy()
    expect(find2.status).toBe(200)
    expect(find2.body.data).toBeTruthy()
    expect(find2.body.data.attributes).not.toHaveProperty("firstName")
    expect(find2.body.data.attributes).toHaveProperty("lastName")
  })

  it("should create a record and error when fetching unknown attributes", async () => {
    const create = await fetch("/api/models", {
      method: "post",
      body: {
        data: {
          type: "Model",
          attributes: {
            firstName: "firstName",
            lastName: "lastName",
          },
        },
      },
    })

    expect(create).toBeTruthy()
    expect(create.status).toBe(200)
    expect(create.body.data).toHaveProperty("id")

    const find1 = await fetch(
      `/api/models/${create.body.data.id}?fields[]=badAttribute`,
    )

    expect(find1).toBeTruthy()
    expect(find1.status).not.toBe(200) // This should be improved
  })

  it("should create several record and fetch all with specific attributes", async () => {
    await fetch("/api/models", {
      method: "post",
      body: {
        data: {
          type: "Model",
          attributes: {
            firstName: "firstName1",
            lastName: "lastName1",
          },
        },
      },
    })

    await fetch("/api/models", {
      method: "post",
      body: {
        data: {
          type: "Model",
          attributes: {
            firstName: "firstName2",
            lastName: "lastName2",
          },
        },
      },
    })

    await fetch("/api/models", {
      method: "post",
      body: {
        data: {
          type: "Model",
          attributes: {
            firstName: "firstName3",
            lastName: "lastName3",
          },
        },
      },
    })

    const find1 = await fetch("/api/models/?fields[]=firstName")

    expect(find1).toBeTruthy()
    expect(find1.status).toBe(200)
    expect(find1.body.data).toHaveProperty("length")
    expect(find1.body.data.length).toBe(3)
    ;(find1.body.data as any[]).forEach((entry) => {
      expect(entry.attributes).toHaveProperty("firstName")
      expect(entry.attributes).not.toHaveProperty("lastName")
    })

    const find2 = await fetch("/api/models/?fields[]=lastName")

    expect(find2).toBeTruthy()
    expect(find2.status).toBe(200)
    expect(find2.body.data).toHaveProperty("length")
    expect(find2.body.data.length).toBe(3)
    ;(find2.body.data as any[]).forEach((entry) => {
      expect(entry.attributes).toHaveProperty("lastName")
      expect(entry.attributes).not.toHaveProperty("firstName")
    })
  })
})
