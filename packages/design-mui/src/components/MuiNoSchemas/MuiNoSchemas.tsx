import { Grid, Typography } from "@mui/material"
import { Robochicken } from "../../assets"

function MuiNoSchemas(): JSX.Element {
  return (
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
    </Grid>
  )
}

MuiNoSchemas.displayName = "NoSchemas"

export default MuiNoSchemas
