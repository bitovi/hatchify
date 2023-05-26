import { Hatchify } from "./index"
import Koa from "koa"
import type { HatchifyModel } from "./types"
import { DataTypes } from "./types"
import { createServer, GET, POST } from "./testing/utils"

describe("Attribute Tests", () => {
  const Model: HatchifyModel = {
    name: "Model",
    attributes: {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        include: "names",
      },
    },
  }

  it("should create a record and fetch specific attributes", async () => {
    const app = new Koa()
    const hatchify = new Hatchify([Model], { prefix: "/api" })
    app.use(hatchify.middleware.allModels.all)

    const server = createServer(app)
    await hatchify.createDatabase()

    const create = await POST(server, "/api/models", {
      firstName: "firstName",
      lastName: "lastName",
    })

    expect(create).toBeTruthy()
    expect(create.status).toBe(200)
    expect(create.deserialized).toHaveProperty("id")

    const find1 = await GET(
      server,
      "/api/models/" + create.deserialized.id + "?fields[Model]=firstName",
    )

    expect(find1).toBeTruthy()
    expect(find1.status).toBe(200)
    expect(find1.serialized.data).toBeTruthy()
    expect(find1.deserialized).toHaveProperty("first_name")
    expect(find1.deserialized).not.toHaveProperty("last_name")

    const find2 = await GET(
      server,
      "/api/models/" + create.deserialized.id + "?fields[Model]=lastName",
    )

    expect(find2).toBeTruthy()
    expect(find2.status).toBe(200)
    expect(find2.serialized.data).toBeTruthy()
    expect(find2.deserialized).not.toHaveProperty("first_name")
    expect(find2.deserialized).toHaveProperty("last_name")

    await hatchify.orm.close()
  })

  it("should create a record and error when fetching unknown attributes", async () => {
    const app = new Koa()
    const hatchify = new Hatchify([Model], { prefix: "/api" })
    app.use(hatchify.middleware.allModels.all)

    const server = createServer(app)
    await hatchify.createDatabase()

    const create = await POST(server, "/api/models", {
      firstName: "firstName",
      lastName: "lastName",
    })

    expect(create).toBeTruthy()
    expect(create.status).toBe(200)
    expect(create.deserialized).toHaveProperty("id")

    const find1 = await GET(
      server,
      "/api/models/" + create.deserialized.id + "?fields[Model]=badAttribute",
    )

    expect(find1).toBeTruthy()
    expect(find1.status).not.toBe(200) // This should be improved

    await hatchify.orm.close()
  })

  it("should create several record and fetch all with specific attributes", async () => {
    const app = new Koa()
    const hatchify = new Hatchify([Model], { prefix: "/api" })
    app.use(hatchify.middleware.allModels.all)

    const server = createServer(app)
    await hatchify.createDatabase()

    await POST(server, "/api/models", {
      firstName: "firstName1",
      lastName: "lastName1",
    })

    await POST(server, "/api/models", {
      firstName: "firstName2",
      lastName: "lastName2",
    })

    await POST(server, "/api/models", {
      firstName: "firstName3",
      lastName: "lastName3",
    })

    const find1 = await GET(server, "/api/models/?fields[Model]=firstName")

    expect(find1).toBeTruthy()
    expect(find1.status).toBe(200)
    expect(find1.deserialized).toHaveProperty("length")
    expect(find1.deserialized.length).toBe(3)

    find1.deserialized.forEach((entry) => {
      expect(entry).toHaveProperty("first_name")
      expect(entry).not.toHaveProperty("last_name")
    })

    const find2 = await GET(server, "/api/models/?fields[Model]=lastName")

    expect(find2).toBeTruthy()
    expect(find2.status).toBe(200)
    expect(find2.deserialized).toHaveProperty("length")
    expect(find2.deserialized.length).toBe(3)

    find2.deserialized.forEach((entry) => {
      expect(entry).toHaveProperty("last_name")
      expect(entry).not.toHaveProperty("first_name")
    })

    await hatchify.orm.close()
  })
})
