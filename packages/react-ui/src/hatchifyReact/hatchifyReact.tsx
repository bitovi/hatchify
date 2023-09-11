import type { ReactRest, SchemaRecord } from "@hatchifyjs/react-rest"
import type { Source, Schemas, Fields, Include } from "@hatchifyjs/rest-client"
import type { HatchifyCollectionProps as InternalHatchifyCollectionProps } from "../components/HatchifyCollection"
import type { HatchifyEmptyProps } from "../components/HatchifyEmpty"
import type { CollectionState } from "../hooks/useCollectionState"
import type {
  AdditionalColumnProps,
  ReplaceColumnProps,
  OverwriteColumnProps,
} from "../components/HatchifyColumn"
import hatchifyReactRest from "@hatchifyjs/react-rest"
import { transformSchema } from "@hatchifyjs/rest-client"
import { HatchifyCollection } from "../components/HatchifyCollection"
import { HatchifyColumn } from "../components/HatchifyColumn"
import { HatchifyEmpty } from "../components/HatchifyEmpty"
import useCollectionState from "../hooks/useCollectionState"

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
      }?: {
        defaultSelected?: HatchifyCollectionProps["defaultSelected"]
        onSelectedChange?: HatchifyCollectionProps["onSelectedChange"]
        fields?: Fields
        include?: Include
      }) => CollectionState
    }
  }
}

export function hatchifyReact(dataSource: Source): HatchifyApp {
  const { completeSchemaMap } = dataSource

  const reactRest = hatchifyReactRest(completeSchemaMap, dataSource)

  const schemas = Object.values(completeSchemaMap).reduce((acc, schema) => {
    acc[schema.name] = transformSchema(schema)
    return acc
  }, {} as Schemas)

  const components = Object.values(schemas).reduce((acc, schema) => {
    acc[schema.name] = {
      Collection: (props) => (
        <HatchifyCollection
          allSchemas={schemas}
          schemaName={schema.name}
          restClient={reactRest}
          {...props}
        />
      ),
      Column: (props) => (
        // todo fix ts!!!
        <HatchifyColumn
          allSchemas={schemas}
          schemaName={schema.name}
          {...props}
        />
      ),
      Empty: (props) => <HatchifyEmpty {...props} />,
    }

    return acc
  }, {} as HatchifyApp["components"])

  const state = Object.values(schemas).reduce((acc, schema) => {
    acc[schema.name] = {
      useCollectionState: ({
        defaultSelected,
        onSelectedChange,
        fields,
        include,
      } = {}) =>
        useCollectionState(schemas, schema.name, reactRest, {
          defaultSelected,
          onSelectedChange,
          fields,
          include,
        }),
    }
    return acc
  }, {} as HatchifyApp["state"])

  return {
    components,
    model: reactRest,
    state,
  }
}
