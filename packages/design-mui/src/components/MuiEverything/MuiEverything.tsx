import {Grid, Tabs, Tab, Typography} from "@mui/material";
import { HatchifyEmpty } from "@hatchifyjs/react-ui"
import type { XEverythingProps } from "@hatchifyjs/react-ui"
import type { PartialSchema } from "@hatchifyjs/core"
import type { GetSchemaNames } from "@hatchifyjs/rest-client"
import { MuiDataGrid } from "../MuiDataGrid/index.js"
import { Robochicken } from "../../assets/index.js"

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
                  style={{ textTransform: "none" }}
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
              <Robochicken />
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="body1"
                margin="1rem"
                color="black"
                justifyContent="center"
                display="flex"
              >
                <span>
                  There are no schemas.&#32;
                  <a
                    href="https://github.com/bitovi/hatchify?tab=readme-ov-file#schemas"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Create some to get started!
                  </a>
                </span>
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
                  <Robochicken />
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
