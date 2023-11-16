import { MuiDataGrid } from "../MuiDataGrid"
import Grid from "@mui/material/Grid"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Typography from "@mui/material/Typography"
import { Eggbert } from "../../assets"
import type { XEverythingProps } from "@hatchifyjs/react-ui"
import type { PartialSchema } from "@hatchifyjs/core"
import type { GetSchemaNames } from "@hatchifyjs/rest-client"
import { HatchifyEmpty } from "@hatchifyjs/react-ui"

export function MuiEverything<
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>({
  children,
  data,
  finalSchemas,
  schemaName,
  setSelectedSchema,
  ...props
}: XEverythingProps<TSchemas, TSchemaName>): JSX.Element {
  return (
    <Grid container>
      <Grid item xs={3} sx={{ backgroundColor: "white" }} height="auto">
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
                  onClick={() => setSelectedSchema(schemaName as TSchemaName)}
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
            <HatchifyEmpty>
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
            </HatchifyEmpty>
          </MuiDataGrid>
        )}
      </Grid>
    </Grid>
  )
}

export default MuiEverything
