import {
  hatchifyReact,
  HatchifyProvider,
  createJsonapiClient,
} from "@hatchifyjs/react"
import { createTheme, ThemeProvider } from "@mui/material"
import * as Schemas from "../schemas"

export const hatchedReact = hatchifyReact(
  createJsonapiClient("http://localhost:3000/api", Schemas),
)

const Everything = hatchedReact.Everything

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <Everything />
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App
