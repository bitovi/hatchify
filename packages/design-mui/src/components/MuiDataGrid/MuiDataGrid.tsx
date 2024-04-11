import { useId } from "react"
import type { XDataGridProps } from "@hatchifyjs/react-ui"
import { Grid } from "@mui/material"
import MuiPagination from "../MuiPagination/MuiPagination.js"
import MuiList from "../MuiList/MuiList.js"
import MuiFilters from "../MuiFilters/MuiFilters.js"

const MuiDataGrid: React.FC<XDataGridProps> = ({ children, ...props }) => {
  const listWrapperId = useId()

  return (
    <Grid
      container
      direction="column"
      wrap="nowrap"
      justifyContent="flex-start"
      height="100%"
      sx={{ backgroundColor: "white" }}
    >
      <Grid item xs={12} flexBasis="fit-content !important">
        <MuiFilters {...props} />
      </Grid>
      <Grid item xs={12} height="100%" id={listWrapperId}>
        <MuiList {...props} listWrapperId={listWrapperId}>
          {children}
        </MuiList>
      </Grid>
      <Grid item xs={12} flexBasis="fit-content !important">
        <MuiPagination {...props} />
      </Grid>
    </Grid>
  )
}

export default MuiDataGrid
