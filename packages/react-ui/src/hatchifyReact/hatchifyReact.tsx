import type { Schema as LegacySchema } from "@hatchifyjs/hatchify-core"
import type { ReactRest, SchemaRecord } from "@hatchifyjs/react-rest"
import type {
  Fields,
  Filters,
  Include,
  PaginationObject,
  Schemas,
  Source,
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
import {
  schemaNameWithNamespace,
  transformSchema,
} from "@hatchifyjs/rest-client"
import { HatchifyCollection } from "../components/HatchifyCollection"
import { HatchifyColumn } from "../components/HatchifyColumn"
import { HatchifyEmpty } from "../components/HatchifyEmpty"
import useCollectionState from "../hooks/useCollectionState"
import type { SortObject } from "../presentation"

type HatchifyCollectionProps = Omit<
  InternalHatchifyCollectionProps,
  "allSchemas" | "schemaName" | "restClient"
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

export type HatchifyApp = {
  components: Components
  model: ReactRest<SchemaRecord>
  state: {
    [schemaName: string]: {
      useCollectionState: ({
        defaultSelected,
        onSelectedChange,
        fields,
        include,
        defaultPage,
        defaultSort,
        baseFilter,
      }?: {
        defaultSelected?: HatchifyCollectionProps["defaultSelected"]
        onSelectedChange?: HatchifyCollectionProps["onSelectedChange"]
        fields?: Fields
        include?: Include
        defaultPage?: PaginationObject
        defaultSort?: SortObject
        baseFilter?: Filters
      }) => CollectionState
    }
  }
}

export function hatchifyReact(
  legacySchemas: Record<string, LegacySchema>,
  dataSource: Source,
): HatchifyApp {
  const reactRest = hatchifyReactRest(legacySchemas, dataSource)

  const schemas = Object.values(legacySchemas).reduce((acc, schema) => {
    acc[schemaNameWithNamespace(schema)] = transformSchema(schema)
    return acc
  }, {} as Schemas)

  const models = Object.values(schemas).reduce((acc, schema) => {
    const schemaName = schemaNameWithNamespace(schema)

    acc[schemaName] = {
      Collection: (props) => (
        <HatchifyCollection
          allSchemas={schemas}
          schemaName={schemaName}
          restClient={reactRest}
          {...props}
        />
      ),
      Column: (props) => (
        // todo fix ts!!!
        <HatchifyColumn
          allSchemas={schemas}
          schemaName={schemaName}
          {...props}
        />
      ),
      Empty: (props) => <HatchifyEmpty {...props} />,
    }

    return acc
  }, {} as HatchifyApp["components"])

  const state = Object.values(schemas).reduce((acc, schema) => {
    const schemaName = schemaNameWithNamespace(schema)

    acc[schemaName] = {
      useCollectionState: ({
        defaultSelected,
        onSelectedChange,
        fields,
        include,
        defaultPage,
        defaultSort,
        baseFilter,
      } = {}) =>
        useCollectionState(schemas, schema.name, reactRest, {
          defaultSelected,
          onSelectedChange,
          fields,
          include,
          defaultPage,
          defaultSort,
          baseFilter,
        }),
    }
    return acc
  }, {} as HatchifyApp["state"])

  return {
    components: models,
    model: reactRest,
    state,
  }
}
