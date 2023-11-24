import type { XCollectionProps } from "@hatchifyjs/react-ui"
import { Grid } from "@mui/material"
import MuiPagination from "../MuiPagination/MuiPagination"
import MuiList from "../MuiList/MuiList"
import MuiFilters from "../MuiFilters/MuiFilters"

const MuiDataGrid: React.FC<XCollectionProps> = ({ children, ...props }) => {
  return (
    <Grid container sx={{ backgroundColor: "white" }}>
      <Grid item xs={12}>
        <MuiFilters {...props} />
      </Grid>
      <Grid item xs={12}>
        <MuiList {...props}>{children}</MuiList>
      </Grid>
      <Grid item xs={12}>
        <MuiPagination {...props} />
      </Grid>
    </Grid>
  )
}

export default MuiDataGrid
