import type { Context } from "co-body"
import coBody from "co-body"
// import { Deserializer } from "jsonapi-serializer";

export async function parseScaffoldBody(ctx: Context) {
  const parsed = await coBody(ctx)

  // if (type === "application/vnd.api+json") {
  //   const deserializer = new Deserializer({ keyForAttribute: "snake_case" });
  //   const result = await deserializer.deserialize(parsed);
  //   console.log("res=>", result);

  //   return result;
  // }

  return parsed
}
