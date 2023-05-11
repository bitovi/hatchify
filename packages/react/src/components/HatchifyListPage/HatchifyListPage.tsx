import { HatchifyList, useHatchifyPresentation } from ".."
import type {
  FlatRecord,
  ValueComponent,
  XLayoutProps,
} from "../../presentation/interfaces"

interface HatchifyListPageProps extends XLayoutProps {
  valueComponents?: { [attribute: string]: ValueComponent }
  useData?: () => FlatRecord[]
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