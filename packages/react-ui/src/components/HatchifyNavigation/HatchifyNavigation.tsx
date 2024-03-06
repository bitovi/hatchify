import type { FinalSchemas } from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
import { useHatchifyPresentation } from "../index.js"

export interface HatchifyNavigationProps<
  TSchemas extends Record<string, PartialSchema>,
> {
  finalSchemas: FinalSchemas
  partialSchemas: TSchemas
  activeSchema: keyof TSchemas | undefined
  setActiveSchema: (schema: keyof TSchemas) => void
  children?: React.ReactNode | null
}

function HatchifyNavigation<
  const TSchemas extends Record<string, PartialSchema>,
>({ ...props }: HatchifyNavigationProps<TSchemas>): JSX.Element {
  const { Navigation } = useHatchifyPresentation()
  return <Navigation {...props} />
}

HatchifyNavigation.displayName = "Navigation"

export default HatchifyNavigation
