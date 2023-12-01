import { useHatchifyPresentation } from "../../HatchifyPresentationProvider"

export function NoSchemas(): JSX.Element {
  const { Everything } = useHatchifyPresentation()

  return <Everything />
}
