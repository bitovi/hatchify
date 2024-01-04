import { useHatchifyPresentation } from "../../HatchifyPresentationProvider/index.js"

export function NoSchemas(): JSX.Element {
  const { Everything } = useHatchifyPresentation()

  return <Everything />
}
