// hatchify-app/src/App.tsx

import {
  hatchifyReact,
  HatchifyProvider,
  createJsonapiClient,
} from "@hatchifyjs/react"
import schemas from "../schemas/schemas"
import { createTheme, ThemeProvider } from "@mui/material"

export const hatchedReact = hatchifyReact(
  createJsonapiClient("http://localhost:3000/api", schemas),
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
