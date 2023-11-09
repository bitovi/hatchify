import { HatchifyDetails, useHatchifyPresentation } from ".."
import type {
  FlatRecord,
  DataCellValueComponent,
  XLayoutProps,
} from "../../presentation/interfaces"

interface HatchifyDetailsPageProps extends XLayoutProps {
  dataCellValueComponents?: { [attribute: string]: DataCellValueComponent }
  useData?: () => FlatRecord
}

export const HatchifyDetailsPage: React.FC<HatchifyDetailsPageProps> = ({
  schema,
  dataCellValueComponents,
  renderActions,
  children,
  useData,
}) => {
  const { Layout } = useHatchifyPresentation()

  return (
    <Layout schema={schema} renderActions={renderActions}>
      <HatchifyDetails
        schema={schema}
        dataCellValueComponents={dataCellValueComponents}
        useData={useData}
      >
        {children}
      </HatchifyDetails>
    </Layout>
  )
}
