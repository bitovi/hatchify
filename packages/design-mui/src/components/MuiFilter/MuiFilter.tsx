/** @jsxImportSource @emotion/react */
import { Box, Grid } from "@mui/material"

import type { XFilterProps } from "@hatchifyjs/react-ui"

export const MuiFilter: React.FC<XFilterProps> = ({
  schemas,
  schemaName,
  filters,
  setFilters,
}) => {
  return (
    <Grid container spacing={2}>
      <Box>Columns {schemaName}</Box>
      <Box>Operator</Box>
      <Box>Value</Box>
    </Grid>
  )
}
