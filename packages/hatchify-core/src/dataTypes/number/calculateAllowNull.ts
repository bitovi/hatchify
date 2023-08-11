export function calculateAllowNull(
  finalize: true,
  required?: boolean,
  primary?: boolean,
): boolean

export function calculateAllowNull(
  finalize: false,
  required?: boolean,
  primary?: boolean,
): boolean | undefined

export function calculateAllowNull(
  finalize: boolean,
  required?: boolean,
  primary?: boolean,
): boolean | undefined

export function calculateAllowNull(
  finalize: boolean,
  required?: boolean,
  primary?: boolean,
): boolean | undefined {
  if (finalize) {
    return primary ? false : !required
  }
  return required != null ? !required : required
}
