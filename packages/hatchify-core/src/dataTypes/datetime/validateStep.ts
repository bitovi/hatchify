import { validateStep as validateNumericStep } from "../number/validateStep"

const STEP = {
  day: 86400000,
}

export function validateStep(
  value: Date,
  step?: "day" | number,
  min?: Date | typeof Infinity,
): boolean {
  return validateNumericStep(
    value == null ? value : +value,
    typeof step === "string" ? STEP[step] : step,
    min instanceof Date ? +min : min,
  )
}
