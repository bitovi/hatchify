export function validateStep(
  value: number,
  step?: number,
  min?: number,
): boolean {
  if (value == null) {
    return false
  }

  if (!step) {
    return true
  }

  const diff = (!min || min === -Infinity ? value : value - min) % step
  const epsilon = 0.00001 // a small tolerance
  const absDiff = diff < 0 ? -diff : diff
  return absDiff < epsilon || step - absDiff < epsilon
}
