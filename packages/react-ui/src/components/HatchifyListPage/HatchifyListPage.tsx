import { HatchifyList, useHatchifyPresentation } from ".."
import type {
  ValueComponent,
  XLayoutProps,
} from "../../presentation/interfaces"
import type {
  Filter,
  Meta,
  QueryList,
  Record,
  Schemas,
} from "@hatchifyjs/rest-client"

interface HatchifyListPageProps extends XLayoutProps {
  allSchemas: Schemas
  schemaName: string
  useData: (query: QueryList) => [Record[], Meta]
  valueComponents?: { [attribute: string]: ValueComponent }
  children?: React.ReactNode | null
  filter: Filter
}

export const HatchifyListPage: React.FC<HatchifyListPageProps> = ({
  schema, // todo: legacy schema, remove when XLayout is updated
  allSchemas,
  schemaName,
  valueComponents,
  renderActions,
  children,
  useData,
  filter,
}) => {
  const { Layout } = useHatchifyPresentation()

  return (
    <Layout schema={schema} renderActions={renderActions}>
      <HatchifyList
        allSchemas={allSchemas}
        schemaName={schemaName}
        valueComponents={valueComponents}
        useData={useData}
        filter={filter}
      >
        {children}
      </HatchifyList>
    </Layout>
  )
}
