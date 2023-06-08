import { HatchifyList, useHatchifyPresentation } from ".."
import type {
  ValueComponent,
  XLayoutProps,
} from "../../presentation/interfaces"
import type { Meta, QueryList, Record, Schemas } from "@hatchifyjs/rest-client"

interface HatchifyListPageProps extends XLayoutProps {
  allSchemas: Schemas
  schemaName: string
  useData: (query: QueryList) => [Record[], Meta]
  valueComponents?: { [attribute: string]: ValueComponent }
  children?: React.ReactNode | null
}

export const HatchifyListPage: React.FC<HatchifyListPageProps> = ({
  schema, // todo: legacy schema, remove when XLayout is updated
  allSchemas,
  schemaName,
  valueComponents,
  renderActions,
  children,
  useData,
}) => {
  const { Layout } = useHatchifyPresentation()

  return (
    <Layout schema={schema} renderActions={renderActions}>
      <HatchifyList
        allSchemas={allSchemas}
        schemaName={schemaName}
        valueComponents={valueComponents}
        useData={useData}
      >
        {children}
      </HatchifyList>
    </Layout>
  )
}
