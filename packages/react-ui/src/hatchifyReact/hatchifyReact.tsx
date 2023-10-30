import {
  assembler,
  // integer, datetime, string, boolean
} from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"
import type { HatchifyReactRest } from "@hatchifyjs/react-rest"
import type {
  Fields,
  Filters,
  Include,
  RestClient,
  PaginationObject,
  GetSchemaNames,
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
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = Omit<
  InternalHatchifyCollectionProps<TSchemas, TSchemaName>,
  "finalSchemas" | "partialSchemas" | "schemaName" | "restClient"
>

type HatchifyColumnProps<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> =
  | Omit<AdditionalColumnProps, "allSchemas" | "schemaName">
  | Omit<ReplaceColumnProps<TSchemas, TSchemaName>, "allSchemas" | "schemaName">
  | Omit<
      OverwriteColumnProps<TSchemas, TSchemaName>,
      "allSchemas" | "schemaName"
    >

type Components<TSchemas extends Record<string, PartialSchema>> = {
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

export type HatchifyApp<TSchemas extends Record<string, PartialSchema>> = {
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

export function hatchifyReact<
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(restClient: RestClient<TSchemas, TSchemaName>): HatchifyApp<TSchemas> {
  const { completeSchemaMap: partialSchemas } = restClient
  const finalSchemas = assembler(partialSchemas)
  const reactRest = hatchifyReactRest(restClient)

  const components = Object.entries(partialSchemas).reduce(
    (acc, [schemaName, schema]) => {
      const key = schemaName as keyof typeof acc
      const finalSchemaName = schema.namespace
        ? `${schema.namespace}_${schema.name}`
        : schema.name
      acc[key] = {
        Collection: (props) => (
          <HatchifyCollection<TSchemas, GetSchemaNames<TSchemas>>
            finalSchemas={finalSchemas}
            partialSchemas={partialSchemas}
            schemaName={finalSchemaName}
            restClient={reactRest}
            {...props}
          />
        ),
        Column: (props) => (
          // todo fix ts!!!
          <HatchifyColumn<TSchemas, GetSchemaNames<TSchemas>>
            allSchemas={finalSchemas as any} // todo:arthur
            schemaName={finalSchemaName}
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

// todo: leaving for testing, remove before merge to main
// const partialTodo = {
//   name: "Todo",
//   attributes: {
//     title: string(),
//     reqTitle: string({ required: true }),
//     age: integer({ required: true }),
//     optAge: integer({ required: false }),
//     important: boolean({ required: true }),
//     optImportant: boolean(),
//     created: datetime({ required: true }),
//     optCreated: datetime(),
//   },
// } satisfies PartialSchema
// const partialUser = {
//   name: "User",
//   attributes: {
//     name: string({ required: true }),
//     age: integer({ required: true }),
//     employed: boolean(),
//   },
// }

// const schemas = { Todo: partialTodo, User: partialUser }

// const app = hatchifyReact({
//   completeSchemaMap: schemas,
// } as RestClient<typeof schemas>)

// app.model.Todo.createOne({
//   attributes: {
//     reqTitle: "",
//     age: 1,
//     important: true,
//     created: new Date(),
//     shouldError: false,
//   },
// })

// app.model.User.findAll({}).then(([records]) => {
//   records[0].id
//   records[0].name
//   records[0].employed
//   records[0].shouldError
// })

// const state = app.state.Todo.useCollectionState()
// state.data[0].id
// state.data[0].age
// state.data[0].optAge
// state.data[0].shouldError

// const TodoList = app.components.Todo.Collection
// const TodoColumn = app.components.Todo.Column

// function Test() {
//   return <TodoList>
//     <TodoColumn field="age" />
//   </TodoList>
// }
