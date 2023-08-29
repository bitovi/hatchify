import { assembler } from "@hatchifyjs/hatchify-core"
import type { HatchifyReactRest } from "@hatchifyjs/react-rest"
import type {
  Fields,
  Include,
  RestClient,
  GetSchemaNames,
  PartialSchemas,
} from "@hatchifyjs/rest-client"
import type { HatchifyCollectionProps as InternalHatchifyCollectionProps } from "../components/HatchifyCollection"
import type { HatchifyEmptyProps } from "../components/HatchifyEmpty"
import type { CollectionState } from "../hooks/useCollectionState"
import type {
  AdditionalColumnProps,
  ReplaceColumnProps,
  OverwriteColumnProps,
} from "../components/HatchifyColumn"
import hatchifyReactRest from "@hatchifyjs/react-rest"
import { HatchifyCollection } from "../components/HatchifyCollection"
import { HatchifyColumn } from "../components/HatchifyColumn"
import { HatchifyEmpty } from "../components/HatchifyEmpty"
import useCollectionState from "../hooks/useCollectionState"

type HatchifyCollectionProps = Omit<
  InternalHatchifyCollectionProps,
  "finalSchemas" | "partialSchemas" | "schemaName" | "restClient"
>

type HatchifyColumnProps =
  | Omit<AdditionalColumnProps, "allSchemas" | "schemaName">
  | Omit<ReplaceColumnProps, "allSchemas" | "schemaName">
  | Omit<OverwriteColumnProps, "allSchemas" | "schemaName">

type Components = {
  [schemaName: string]: {
    // core
    Collection: (props: HatchifyCollectionProps) => React.ReactElement
    // compound
    Column: (props: HatchifyColumnProps) => React.ReactElement
    Empty: (props: HatchifyEmptyProps) => React.ReactElement
  }
}

type HatchifyApp<TSchemas extends PartialSchemas> = {
  components: Components
  model: HatchifyReactRest<TSchemas>
  state: {
    [SchemaName in keyof TSchemas]: {
      useCollectionState: ({
        defaultSelected,
        onSelectedChange,
        fields,
        include,
      }: {
        defaultSelected?: HatchifyCollectionProps["defaultSelected"]
        onSelectedChange?: HatchifyCollectionProps["onSelectedChange"]
        fields?: Fields
        include?: Include
      }) => CollectionState<TSchemas, SchemaName>
    }
  }
}

export function hatchifyReact<const TSchemas extends PartialSchemas>(
  partialSchemas: TSchemas,
  restClient: RestClient,
): HatchifyApp<TSchemas> {
  const finalSchemas = assembler(partialSchemas)
  const reactRest = hatchifyReactRest(partialSchemas, restClient)

  const components = Object.values(finalSchemas).reduce((acc, schema) => {
    acc[schema.name] = {
      Collection: (props) => (
        <HatchifyCollection
          finalSchemas={finalSchemas}
          partialSchemas={partialSchemas}
          schemaName={schema.name}
          restClient={reactRest}
          {...props}
        />
      ),
      Column: (props) => (
        // todo fix ts!!!
        <HatchifyColumn
          allSchemas={finalSchemas as any} // todo:arthur
          schemaName={schema.name}
          {...props}
        />
      ),
      Empty: (props) => <HatchifyEmpty {...props} />,
    }

    return acc
  }, {} as HatchifyApp<TSchemas>["components"])

  const state = Object.entries(partialSchemas).reduce(
    (acc, [schemaName, schema]) => {
      const key = schemaName as keyof typeof acc
      acc[key] = {
        useCollectionState: ({
          defaultSelected,
          onSelectedChange,
          fields,
          include,
        } = {}) =>
          useCollectionState<TSchemas, GetSchemaNames<TSchemas>>(
            finalSchemas,
            partialSchemas,
            key,
            reactRest,
            {
              defaultSelected,
              onSelectedChange,
              fields,
              include,
            },
          ),
      }
      return acc
    },
    {} as HatchifyApp<TSchemas>["state"],
  )

  return {
    components,
    model: reactRest,
    state,
  }
}

// const partialTodo = {
//   name: "Todo",
//   attributes: {
//     date: integer(),
//     importance: integer(),
//   },
// }

// const partialUser = {
//   name: "User",
//   attributes: {
//     age: integer({ required: true }),
//     name: {
//       control: { type: "String" } as any,
//     },
//   },
// }

// const app = hatchifyReact(
//   { Todo: partialTodo, User: partialUser },
//   undefined as any,
// )

// const [records] = app.model.User.useAll()
// records[0].id
// records[0].age
// records[0].name
// records[0].adsfa
