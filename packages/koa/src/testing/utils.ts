import http from "node:http"
import type Koa from "koa"
import request from "supertest"
import { Deserializer } from "jsonapi-serializer"
import { HatchifyError } from "../error/errors"
import { codes, statusCodes } from "../error/constants"

export function createServer(app: Koa) {
  return http.createServer(app.callback())
}

async function parse(result) {
  let serialized
  let deserialized
  let text
  let status

  if (!result) {
    throw new HatchifyError({
      title: "Invalid Result",
      code: codes.ERR_INVALID_RESULT,
      status: statusCodes.UNPROCESSABLE_ENTITY,
    })
  }

  if (result.statusCode) {
    status = result.statusCode
  }

  if (result.text) {
    text = result.text

    try {
      const temp = JSON.parse(result.text)
      serialized = temp
    } catch (err) {
      // do nothing, its just not JSON probably
    }

    try {
      const deserializer = new Deserializer({ keyForAttribute: "snake_case" })
      const temp = await deserializer.deserialize(serialized)
      deserialized = temp
    } catch (err) {
      // do nothing, its just not JSON:API probably
    }
  }

  return {
    text,
    status,
    serialized,
    deserialized,
  }
}

export async function GET(server, path) {
  const result = await request(server).get(path).set("authorization", "test")
  return parse(result)
}

export async function DELETE(server, path) {
  const result = await request(server).delete(path).set("authorization", "test")

  return await parse(result)
}

export async function POST(server, path, payload, type = "application/json") {
  const result = await request(server)
    .post(path)
    .set("authorization", "test")
    .set("content-type", type)
    .send(payload)

  return await parse(result)
}

export async function PUT(server, path, payload, type = "application/json") {
  const result = await request(server)
    .put(path)
    .set("authorization", "test")
    .set("content-type", type)
    .send(payload)

  return await parse(result)
}
