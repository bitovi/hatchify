import type { Schema as LegacySchema } from "@hatchifyjs/hatchify-core"
import type { ReactRest, SchemaRecord } from "@hatchifyjs/react-rest"
import type { Source, Schemas } from "@hatchifyjs/rest-client"
import hatchifyReactRest from "@hatchifyjs/react-rest"
import { transformSchema } from "@hatchifyjs/rest-client"

import type { HatchifyListProps } from "../components/HatchifyList/HatchifyList"
import {
  HatchifyAttributeDisplay,
  HatchifyExtraDisplay,
} from "../components/HatchifyDisplays/HatchifyDisplays"
import type {
  HatchifyAttributeDisplayProps,
  HatchifyExtraDisplayProps,
} from "../components/HatchifyDisplays/HatchifyDisplays"
import { HatchifyList } from "../components/HatchifyList"

type Components = {
  [schemaName: string]: {
    List: (
      props: Omit<HatchifyListProps, "allSchemas" | "schemaName" | "useData">,
    ) => React.ReactElement
    AttributeDisplay: (
      props: HatchifyAttributeDisplayProps,
    ) => React.ReactElement
    ExtraDisplay: (props: HatchifyExtraDisplayProps) => React.ReactElement
  }
}

type HatchifyApp = {
  components: Components
  model: ReactRest<SchemaRecord>
}

export function hatchifyReact(
  legacySchemas: Record<string, LegacySchema>,
  dataSource: Source,
): HatchifyApp {
  const reactRest = hatchifyReactRest(legacySchemas, dataSource)

  const schemas = Object.values(legacySchemas).reduce((acc, schema) => {
    acc[schema.name] = transformSchema(schema)
    return acc
  }, {} as Schemas)

  const components = Object.values(schemas).reduce((acc, schema) => {
    acc[schema.name] = {
      List: (props) => (
        <HatchifyList
          allSchemas={schemas}
          schemaName={schema.name}
          useData={reactRest[schema.name].useAll}
          {...props}
        />
      ),
      AttributeDisplay: (props) => <HatchifyAttributeDisplay {...props} />,
      ExtraDisplay: (props) => <HatchifyExtraDisplay {...props} />,
    }

    return acc
  }, {} as HatchifyApp["components"])

  return {
    components,
    model: reactRest,
  }
}
