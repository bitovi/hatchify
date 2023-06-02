import { HatchifyList, useHatchifyPresentation } from ".."
import type {
  ValueComponent,
  XLayoutProps,
  FlatRecord,
} from "../../presentation/interfaces"
// import type { Meta, QueryList, Record } from "@hatchifyjs/rest-client"

interface HatchifyListPageProps extends XLayoutProps {
  valueComponents?: { [attribute: string]: ValueComponent }
  useData?: () => FlatRecord[]
  // useData: (query: QueryList) => [Record[], Meta]
}

export const HatchifyListPage: React.FC<HatchifyListPageProps> = ({
  schema,
  valueComponents,
  renderActions,
  children,
  useData,
}) => {
  const { Layout } = useHatchifyPresentation()

  return (
    <Layout schema={schema} renderActions={renderActions}>
      <HatchifyList
        schema={schema}
        valueComponents={valueComponents}
        useData={useData}
      >
        {children}
      </HatchifyList>
    </Layout>
  )
}
