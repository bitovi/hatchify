import { HatchifyDetails, useHatchifyPresentation } from ".."
import type {
  FlatRecord,
  DataCellValueComponent,
  HeaderCellValueComponent,
  XLayoutProps,
} from "../../presentation/interfaces"

interface HatchifyDetailsPageProps extends XLayoutProps {
  dataCellValueComponents?: { [attribute: string]: DataCellValueComponent }
  headerCellValueComponents?: { [attribute: string]: HeaderCellValueComponent }
  useData?: () => FlatRecord
}

export const HatchifyDetailsPage: React.FC<HatchifyDetailsPageProps> = ({
  schema,
  dataCellValueComponents,
  headerCellValueComponents,
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
        headerCellValueComponents={headerCellValueComponents}
        useData={useData}
      >
        {children}
      </HatchifyDetails>
    </Layout>
  )
}
