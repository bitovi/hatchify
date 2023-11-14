import { MuiDataGrid } from "../MuiDataGrid"
import Grid from "@mui/material/Grid"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Typography from "@mui/material/Typography"
import { Eggbert } from "../../assets"
import type { XEverythingProps } from "@hatchifyjs/react-ui"

const MuiEverything: React.FC<XEverythingProps> = ({
  data,
  finalSchemas,
  schemaName,
  setSelectedSchema,
  ...props
}) => {
  return (
    <Grid container>
      <Grid item xs={3} sx={{ backgroundColor: "lightgrey" }} height="auto">
        {!finalSchemas ? (
          <Typography variant="body1" margin="1rem">
            There are no schemas. Create some to get started!
          </Typography>
        ) : (
          <Tabs orientation="vertical" value={schemaName}>
            {Object.keys(finalSchemas).map((schemaName) => {
              return (
                <Tab
                  value={schemaName}
                  label={schemaName}
                  key={schemaName}
                  onClick={() => setSelectedSchema(schemaName)}
                />
              )
            })}
          </Tabs>
        )}
      </Grid>
      <Grid item xs={9}>
        {!finalSchemas ? (
          <Grid container rowSpacing={4}>
            <Grid item xs={12}>
              <Typography variant="h2" justifyContent="center" display="flex">
                Welcome to Hatchify!
              </Typography>
            </Grid>
            <Grid item xs={12} justifyContent="center" display="flex">
              <Eggbert />
            </Grid>
          </Grid>
        ) : (
          <MuiDataGrid
            {...props}
            data={data}
            finalSchemas={finalSchemas}
            schemaName={schemaName}
          >
            <EverythingEmpty>
              <Grid container rowSpacing={4}>
                <Grid item xs={12}>
                  <Typography
                    variant="body1"
                    justifyContent="center"
                    display="flex"
                  >
                    No records found. Create some to get started.
                  </Typography>
                </Grid>
                <Grid item xs={12} justifyContent="center" display="flex">
                  <Eggbert />
                </Grid>
              </Grid>
            </EverythingEmpty>
          </MuiDataGrid>
        )}
      </Grid>
    </Grid>
  )
}

export type EverythingEmptyProps = {
  children: React.ReactNode
}

export const EverythingEmpty: React.FC<EverythingEmptyProps> = () => {
  return null
}

EverythingEmpty.displayName = "Empty"

export default MuiEverything
