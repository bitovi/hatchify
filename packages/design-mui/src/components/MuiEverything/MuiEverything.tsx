import Grid from "@mui/material/Grid"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Typography from "@mui/material/Typography"
import { HatchifyEmpty } from "@hatchifyjs/react-ui"
import type { XEverythingProps } from "@hatchifyjs/react-ui"
import type { PartialSchema } from "@hatchifyjs/core"
import type { GetSchemaNames } from "@hatchifyjs/rest-client"
import { MuiDataGrid } from "../MuiDataGrid"
import { Eggbert } from "../../assets"

export function MuiEverything<
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>({
  children,
  finalSchemas,
  partialSchemas,
  schemaName,
  setSelectedSchema,
  ...props
}: XEverythingProps<TSchemas, TSchemaName>): JSX.Element {
  return (
    <Grid container>
      {partialSchemas && (
        <Grid item xs={3} sx={{ backgroundColor: "white" }} height="auto">
          <Tabs orientation="vertical" value={schemaName}>
            {Object.keys(partialSchemas).map((schemaName) => {
              return (
                <Tab
                  value={schemaName}
                  label={schemaName}
                  key={schemaName}
                  onClick={() =>
                    setSelectedSchema &&
                    setSelectedSchema(schemaName as TSchemaName)
                  }
                />
              )
            })}
          </Tabs>
        </Grid>
      )}
      <Grid item xs={partialSchemas ? 9 : 12}>
        {!finalSchemas ? (
          <Grid container rowSpacing={4}>
            <Grid item xs={12}>
              <Typography
                variant="h2"
                justifyContent="center"
                display="flex"
                color="black"
              >
                Welcome to Hatchify!
              </Typography>
            </Grid>
            <Grid item xs={12} justifyContent="center" display="flex">
              <Eggbert />
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="body1"
                margin="1rem"
                color="black"
                justifyContent="center"
                display="flex"
              >
                There are no schemas. Create some to get started!
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <MuiDataGrid
            {...(props as Required<XEverythingProps>)}
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
