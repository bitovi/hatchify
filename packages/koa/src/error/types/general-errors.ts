import { ScaffoldError } from "../errors"

const ScaffoldErrorHandler = (error) => {
  if (error instanceof ScaffoldError) {
    return error
  }

  error = new ScaffoldError(error)

  return error
}

export default ScaffoldErrorHandler
