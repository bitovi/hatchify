import { HatchifyForm, useHatchifyPresentation } from ".."

import type {
  FieldComponent,
  XLayoutProps,
} from "../../presentation/interfaces"

interface HatchifyFormPageProps extends XLayoutProps {
  isEdit?: boolean
  fieldComponents?: { [attribute: string]: FieldComponent }
  routeOnSuccess: () => void
}

export const HatchifyFormPage: React.FC<HatchifyFormPageProps> = ({
  isEdit = false,
  schema,
  fieldComponents,
  renderActions,
  routeOnSuccess,
  children,
}) => {
  const { Layout } = useHatchifyPresentation()

  return (
    <Layout schema={schema} renderActions={renderActions}>
      <HatchifyForm
        isEdit={isEdit}
        schema={schema}
        fieldComponents={fieldComponents}
        routeOnSuccess={routeOnSuccess}
      >
        {children}
      </HatchifyForm>
    </Layout>
  )
}