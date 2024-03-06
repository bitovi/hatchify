import { assembler } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"
import type { HatchifyReactRest } from "@hatchifyjs/react-rest"
import type {
  Fields,
  Filters,
  Include,
  RestClient,
  PaginationObject,
  GetSchemaNames,
  GetSchemaFromName,
} from "@hatchifyjs/rest-client"
import type { HatchifyDataGridProps as InternalHatchifyDataGridProps } from "../components/HatchifyDataGrid/index.js"
import type { HatchifyEverythingProps as InternalHatchifyEverythingProps } from "../components/HatchifyEverything/index.js"
import type { HatchifyNavigationProps as InternalHatchifyNavigationProps } from "../components/HatchifyNavigation/HatchifyNavigation.js"
import type { HatchifyEmptyProps } from "../components/HatchifyEmpty/index.js"
import type { DataGridState } from "../hooks/useDataGridState.js"
import type {
  ReplaceColumnProps,
  ExtraColumnProps,
} from "../components/HatchifyColumn/index.js"
import hatchifyReactRest from "@hatchifyjs/react-rest"
import { HatchifyDataGrid } from "../components/HatchifyDataGrid/index.js"
import { HatchifyColumn } from "../components/HatchifyColumn/index.js"
import { HatchifyEmpty } from "../components/HatchifyEmpty/index.js"
import { HatchifyEverything } from "../components/HatchifyEverything/index.js"
import useDataGridState from "../hooks/useDataGridState.js"
import type { SortObject } from "../presentation/index.js"
import HatchifyNavigation from "../components/HatchifyNavigation/HatchifyNavigation.js"
import HatchifyNoSchemas from "../components/HatchifyNoSchemas/HatchifyNavigation.js"

type HatchifyEverythingProps<TSchemas extends Record<string, PartialSchema>> =
  Omit<
    InternalHatchifyEverythingProps<TSchemas>,
    "finalSchemas" | "partialSchemas" | "restClient"
  >

type HatchifyNavigationProps<TSchemas extends Record<string, PartialSchema>> =
  Omit<
    InternalHatchifyNavigationProps<TSchemas>,
    "finalSchemas" | "partialSchemas"
  >

type HatchifyDataGridProps<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = Omit<
  InternalHatchifyDataGridProps<TSchemas, TSchemaName>,
  "finalSchemas" | "partialSchemas" | "schemaName" | "restClient"
>

type HatchifyColumnProps<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> =
  | Omit<ExtraColumnProps<TSchemas, TSchemaName>, "allSchemas" | "schemaName">
  | Omit<ReplaceColumnProps<TSchemas, TSchemaName>, "allSchemas" | "schemaName">

type Components<TSchemas extends Record<string, PartialSchema>> = {
  [SchemaName in keyof TSchemas]: {
    // core
    DataGrid: (
      props: HatchifyDataGridProps<TSchemas, SchemaName>,
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
  Everything: (props: HatchifyEverythingProps<TSchemas>) => JSX.Element
  Navigation: (props: HatchifyNavigationProps<TSchemas>) => JSX.Element
  NoSchemas: () => JSX.Element
  model: HatchifyReactRest<TSchemas>
  state: {
    [SchemaName in keyof TSchemas]: {
      useDataGridState: ({
        defaultSelected,
        onSelectedChange,
        fields,
        include,
        defaultPage,
        defaultSort,
        baseFilter,
        minimumLoadTime,
      }?: {
        defaultSelected?: HatchifyDataGridProps<
          TSchemas,
          SchemaName
        >["defaultSelected"]
        onSelectedChange?: HatchifyDataGridProps<
          TSchemas,
          SchemaName
        >["onSelectedChange"]
        fields?: Fields
        include?: Include<GetSchemaFromName<TSchemas, SchemaName>>
        defaultPage?: PaginationObject
        defaultSort?: SortObject
        baseFilter?: Filters
        minimumLoadTime?: number
      }) => DataGridState<TSchemas, SchemaName>
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
        DataGrid: (props) => (
          <HatchifyDataGrid<TSchemas, GetSchemaNames<TSchemas>>
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
        useDataGridState: ({
          defaultSelected,
          onSelectedChange,
          fields,
          include,
          defaultPage,
          defaultSort,
          baseFilter,
          minimumLoadTime,
        } = {}) =>
          useDataGridState<TSchemas, GetSchemaNames<TSchemas>>(
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
              minimumLoadTime,
            },
          ),
      }
      return acc
    },
    {} as HatchifyApp<TSchemas>["state"],
  )

  const Everything = (props: HatchifyEverythingProps<TSchemas>) => (
    <HatchifyEverything
      {...props}
      finalSchemas={finalSchemas}
      partialSchemas={partialSchemas}
      restClient={reactRest}
    />
  )

  const Navigation = (props: HatchifyNavigationProps<TSchemas>) => (
    <HatchifyNavigation
      {...props}
      finalSchemas={finalSchemas}
      partialSchemas={partialSchemas}
    />
  )

  const NoSchemas = () => <HatchifyNoSchemas />

  return {
    components,
    Everything,
    Navigation,
    NoSchemas,
    model: reactRest,
    state,
  }
}

// todo: leaving for testing, remove once core no longer has `ts-expect-error`s
// const schemas = {
//   Todo: {
//     name: "Todo",
//     displayAttribute: "title",
//     attributes: {
//       title: string(),
//       reqTitle: string({ required: true }),
//       age: integer({ required: true }),
//       optAge: integer({ required: false }),
//       important: boolean({ required: true }),
//       optImportant: boolean(),
//       created: datetime({ required: true }),
//       optCreated: datetime(),
//     },
//     relationships: {
//       user: belongsTo("User"),
//     },
//   },
//   User: {
//     name: "User",
//     attributes: {
//       name: string({ required: true }),
//       age: integer({ required: true }),
//       employed: boolean(),
//     },
//     relationships: {
//       todos: hasMany("Todo").through(),
//     },
//   },
// } satisfies Record<string, PartialSchema>

// const app = hatchifyReact({
//   completeSchemaMap: schemas,
// } as RestClient<typeof schemas, any>)

// app.model.Todo.createOne({
//   reqTitle: "",
//   age: 1,
//   important: true,
//   created: new Date(),
//   shouldError: false,
// })

// app.model.User.findAll({}).then(([records]) => {
//   records[0].id
//   records[0].name
//   records[0].employed
//   records[0].shouldError
// })

// const state = app.state.Admin_Todo.useDataGridState({
//   include: ["user"],
//   baseFilter: [{ field: "age", operator: ">", value: 1 }],
// })
// state.data.map((_todo) => {
//   _todo
// })
// state.data[0].id
// state.data[0].age
// state.data[0].optAge
// state.data[0].shouldError

// const TodoList = app.components.Todo.DataGrid
// const TodoColumn = app.components.Todo.Column

// function AgeComponent() {
//   return <div>hello</div>
// }

// function Test() {
//   return (
//     <TodoList>
//       <TodoColumn
//         field="age"
//         label="Age"
//         renderDataValue={({ record }) => <div>{record.asdfa}</div>}
//       />
//     </TodoList>
//   )
// }
