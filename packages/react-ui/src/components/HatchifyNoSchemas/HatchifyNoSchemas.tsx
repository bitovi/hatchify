import { useHatchifyPresentation } from "../index.js"

function HatchifyNoSchemas(): JSX.Element {
  const { NoSchemas } = useHatchifyPresentation()
  return <NoSchemas />
}

HatchifyNoSchemas.displayName = "NoSchemas"

export default HatchifyNoSchemas
