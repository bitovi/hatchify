import {
  assembler,
  // integer,
  // datetime,
  // string,
  // PartialSchema,
} from "@hatchifyjs/core"
import type { HatchifyReactRest } from "@hatchifyjs/react-rest"
import type {
  Fields,
  Filters,
  Include,
  RestClient,
  PaginationObject,
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
import type { SortObject } from "../presentation"

type HatchifyCollectionProps<
  TSchemas extends PartialSchemas,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = Omit<
  InternalHatchifyCollectionProps<TSchemas, TSchemaName>,
  "finalSchemas" | "partialSchemas" | "schemaName" | "restClient"
>

type HatchifyColumnProps<
  TSchemas extends PartialSchemas,
  TSchemaName extends GetSchemaNames<TSchemas>,
> =
  | Omit<AdditionalColumnProps, "allSchemas" | "schemaName">
  | Omit<ReplaceColumnProps<TSchemas, TSchemaName>, "allSchemas" | "schemaName">
  | Omit<
      OverwriteColumnProps<TSchemas, TSchemaName>,
      "allSchemas" | "schemaName"
    >

type Components<TSchemas extends PartialSchemas> = {
  [SchemaName in keyof TSchemas]: {
    // core
    Collection: (
      props: HatchifyCollectionProps<TSchemas, SchemaName>,
    ) => React.ReactElement
    // compound
    Column: (
      props: HatchifyColumnProps<TSchemas, SchemaName>,
    ) => React.ReactElement
    Empty: (props: HatchifyEmptyProps) => React.ReactElement
  }
}

export type HatchifyApp<TSchemas extends PartialSchemas> = {
  components: Components<TSchemas>
  model: HatchifyReactRest<TSchemas>
  state: {
    [SchemaName in keyof TSchemas]: {
      useCollectionState: ({
        defaultSelected,
        onSelectedChange,
        fields,
        include,
        defaultPage,
        defaultSort,
        baseFilter,
      }?: {
        defaultSelected?: HatchifyCollectionProps<
          TSchemas,
          SchemaName
        >["defaultSelected"]
        onSelectedChange?: HatchifyCollectionProps<
          TSchemas,
          SchemaName
        >["onSelectedChange"]
        fields?: Fields
        include?: Include
        defaultPage?: PaginationObject
        defaultSort?: SortObject
        baseFilter?: Filters
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

  const components = Object.entries(partialSchemas).reduce(
    (acc, [schemaName, schema]) => {
      const key = schemaName as keyof typeof acc
      acc[key] = {
        Collection: (props) => (
          <HatchifyCollection<TSchemas, GetSchemaNames<TSchemas>>
            finalSchemas={finalSchemas}
            partialSchemas={partialSchemas}
            schemaName={schema.name}
            restClient={reactRest}
            {...props}
          />
        ),
        Column: (props) => (
          // todo fix ts!!!
          <HatchifyColumn<TSchemas, GetSchemaNames<TSchemas>>
            allSchemas={finalSchemas as any} // todo:arthur
            schemaName={schema.name}
            {...props}
          />
        ),
        Empty: (props) => <HatchifyEmpty {...props} />,
      }

      return acc
    },
    {} as HatchifyApp<TSchemas>["components"],
  )

  const state = Object.entries(partialSchemas).reduce(
    (acc, [schemaName, schema]) => {
      const key = schemaName as keyof typeof acc
      acc[key] = {
        useCollectionState: ({
          defaultSelected,
          onSelectedChange,
          fields,
          include,
          defaultPage,
          defaultSort,
          baseFilter,
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
              defaultPage,
              defaultSort,
              baseFilter,
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

// // todo: leaving for testing, remove before merge to main
// const Todo = {
//   name: "Todo",
//   attributes: {
//     name: string(),
//     importance: integer(),
//     date: datetime(),
//   }
// } satisfies PartialSchema

// const app = hatchifyReact({ Todo }, undefined as any)

// const [records] = app.model.Todo.useAll()
// // records[0].

// app.model.Todo.createOne({
//   attributes: {
//     importance: 123,
//     name: "123",
//     date: new Date()
//   },
// })

// app.model.Todo.findAll({}).then((todos) => {
//   todos[0][0].
// })

// const List = app.components.Todo.Collection
// const Column = app.components.Todo.Column
// function Test() {
//   return <Column type="replace" field="name" />
// }
