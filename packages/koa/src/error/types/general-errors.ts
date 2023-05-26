import { HatchifyError } from "../errors"

const HatchifyErrorHandler = (error) => {
  if (error instanceof HatchifyError) {
    return error
  }

  error = new HatchifyError(error)

  return error
}

export default HatchifyErrorHandler
