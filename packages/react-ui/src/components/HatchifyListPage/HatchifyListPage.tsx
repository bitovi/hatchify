import { HatchifyList, useHatchifyPresentation } from ".."
import type {
  ValueComponent,
  XLayoutProps,
} from "../../presentation/interfaces"
import type { Meta, QueryList, Record } from "@hatchifyjs/rest-client"

interface HatchifyListPageProps extends XLayoutProps {
  valueComponents?: { [attribute: string]: ValueComponent }
  useData: (query: QueryList) => [Record[], Meta]
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
        useList={useData}
      >
        {children}
      </HatchifyList>
    </Layout>
  )
}
