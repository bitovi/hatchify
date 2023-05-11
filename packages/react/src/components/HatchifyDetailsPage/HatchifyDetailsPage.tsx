import { HatchifyDetails, useHatchifyPresentation } from ".."
import type {
  FlatRecord,
  ValueComponent,
  XLayoutProps,
} from "../../presentation/interfaces"

interface HatchifyDetailsPageProps extends XLayoutProps {
  valueComponents?: { [attribute: string]: ValueComponent }
  useData?: () => FlatRecord
}

export const HatchifyDetailsPage: React.FC<HatchifyDetailsPageProps> = ({
  schema,
  valueComponents,
  renderActions,
  children,
  useData,
}) => {
  const { Layout } = useHatchifyPresentation()

  return (
    <Layout schema={schema} renderActions={renderActions}>
      <HatchifyDetails
        schema={schema}
        valueComponents={valueComponents}
        useData={useData}
      >
        {children}
      </HatchifyDetails>
    </Layout>
  )
}