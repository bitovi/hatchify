import { HatchifyDetails, useHatchifyPresentation } from ".."
import type {
  FlatRecord,
  DataValueComponent,
  HeaderValueComponent,
  XLayoutProps,
} from "../../presentation/interfaces"

interface HatchifyDetailsPageProps extends XLayoutProps {
  dataValueComponents?: { [attribute: string]: DataValueComponent }
  headerValueComponents?: { [attribute: string]: HeaderValueComponent }
  useData?: () => FlatRecord
}

export const HatchifyDetailsPage: React.FC<HatchifyDetailsPageProps> = ({
  schema,
  dataValueComponents,
  headerValueComponents,
  renderActions,
  children,
  useData,
}) => {
  const { Layout } = useHatchifyPresentation()

  return (
    <Layout schema={schema} renderActions={renderActions}>
      <HatchifyDetails
        schema={schema}
        dataValueComponents={dataValueComponents}
        headerValueComponents={headerValueComponents}
        useData={useData}
      >
        {children}
      </HatchifyDetails>
    </Layout>
  )
}
