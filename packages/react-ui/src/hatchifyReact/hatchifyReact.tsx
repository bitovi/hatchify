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
import type { SortObject, XDataGridProps } from "../presentation/index.js"
import { HatchifyNavigation } from "../components/HatchifyNavigation/index.js"
import { HatchifyNoSchemas } from "../components/HatchifyNoSchemas/index.js"
import { HatchifyFilters } from "../components/HatchifyFilters/index.js"
import { HatchifyPagination } from "../components/HatchifyPagination/index.js"
import { HatchifyList } from "../components/HatchifyList/index.js"

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

type HatchifyFiltersProps<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = XDataGridProps<TSchemas, TSchemaName>

type HatchifyPaginationProps<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = XDataGridProps<TSchemas, TSchemaName>

type HatchifyListProps<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = XDataGridProps<TSchemas, TSchemaName>

type HatchifyColumnProps<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> =
  | Omit<ExtraColumnProps<TSchemas, TSchemaName>, "allSchemas" | "schemaName">
  | Omit<ReplaceColumnProps<TSchemas, TSchemaName>, "allSchemas" | "schemaName">

type Components<TSchemas extends Record<string, PartialSchema>> = {
  [SchemaName in keyof TSchemas]: {
    // compound (state managed)
    DataGrid: ((
      props: HatchifyDataGridProps<TSchemas, SchemaName>,
    ) => React.ReactElement) & {
      Column: (
        props: HatchifyColumnProps<TSchemas, SchemaName>,
      ) => React.ReactElement
      Empty: (props: HatchifyEmptyProps) => React.ReactElement
    }
    // unmanaged state
    Filters: (
      props: HatchifyFiltersProps<TSchemas, SchemaName>,
    ) => React.ReactElement
    Pagination: (
      props: HatchifyPaginationProps<TSchemas, SchemaName>,
    ) => React.ReactElement
    List: (props: HatchifyListProps<TSchemas, SchemaName>) => React.ReactElement
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

      const dataGridCompoundComponents = (
        props: HatchifyDataGridProps<TSchemas, TSchemaName>,
      ) => (
        <HatchifyDataGrid<TSchemas, GetSchemaNames<TSchemas>>
          finalSchemas={finalSchemas}
          partialSchemas={partialSchemas}
          schemaName={finalSchemaName}
          restClient={reactRest}
          {...props}
        />
      )

      function Column(props: HatchifyColumnProps<TSchemas, TSchemaName>) {
        return (
          <HatchifyColumn<TSchemas, GetSchemaNames<TSchemas>>
            allSchemas={finalSchemas}
            schemaName={finalSchemaName}
            {...props}
          />
        )
      }

      function Empty(props: HatchifyEmptyProps) {
        return <HatchifyEmpty {...props} />
      }

      Column.displayName = "Column"
      Empty.displayName = "Empty"
      dataGridCompoundComponents.Column = Column
      dataGridCompoundComponents.Empty = Empty

      acc[key] = {
        DataGrid: dataGridCompoundComponents,
        Filters: (props) => (
          <HatchifyFilters<TSchemas, GetSchemaNames<TSchemas>> {...props} />
        ),
        Pagination: (props) => (
          <HatchifyPagination<TSchemas, GetSchemaNames<TSchemas>> {...props} />
        ),
        List: (props) => (
          <HatchifyList<TSchemas, GetSchemaNames<TSchemas>> {...props} />
        ),
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
