// import { createReactRest } from "@hatchifyjs/react-rest"
// import type { Schema } from "@hatchifyjs/hatchify-core"
// import type { Source } from "@hatchifyjs/rest-client"
// import type { ReactRest } from "@hatchifyjs/react-rest"
// import { HatchifyList } from "../components/HatchifyList"

// type Components = {
//   [schemaName: string]: {
//     List: () => any
//   }
// }

// type HatchifyApp = {
//   components: Components
//   model: ReactRest
// }

// export function hatchifyReact(
//   schemas: { [schemaName: string]: Schema },
//   dataSource: Source,
// ): HatchifyApp {
//   const rest = createReactRest(schemas, dataSource)

//   const components = Object.values(schemas).reduce((acc, oldSchema) => {
//     // const schema = transformSchema(oldSchema)
//     const schema = oldSchema

//     acc[schema.name] = {
//       List: () => (
//         <HatchifyList schema={schema} useList={rest[schema.name].useList} />
//       ),
//     }

//     return acc
//   }, {} as HatchifyApp["components"])

//   return {
//     components,
//     model: rest,
//   }
// }
