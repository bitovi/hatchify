import type { XDataGridProps } from "@hatchifyjs/react-ui"
import { Grid } from "@mui/material"
import MuiPagination from "../MuiPagination/MuiPagination.js"
import MuiList from "../MuiList/MuiList.js"
import MuiFilters from "../MuiFilters/MuiFilters.js"

const MuiDataGrid: React.FC<XDataGridProps> = ({ children, ...props }) => {
  return (
    <Grid container sx={{ backgroundColor: "white" }}>
      <Grid item xs={12}>
        <MuiFilters {...props} />
      </Grid>
      <Grid item xs={12} sx={{ minHeight: "80vh" }}>
        <MuiList {...props}>{children}</MuiList>
      </Grid>
      <Grid item xs={12}>
        <MuiPagination {...props} />
      </Grid>
    </Grid>
  )
}

export default MuiDataGrid
