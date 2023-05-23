/** @jsxImportSource @emotion/react */
import { Suspense } from "react"
import { Box, Grid } from "@mui/material"
import { css } from "@emotion/react"

import type { XDetailsProps } from "@hatchifyjs/react"

const styles = {
  label: css`
    font-weight: bold;
  `,
  box: css`
    background-color: white;
    padding: 10px 0px;
    margin: 15px;
  `,
}

export const MuiDetails: React.FC<XDetailsProps> = ({ displays, useData }) => {
  return (
    <Box css={styles.box}>
      <Suspense fallback={<div>loading...</div>}>
        <MuiFields displays={displays} useData={useData} />
      </Suspense>
    </Box>
  )
}

const MuiFields: React.FC<XDetailsProps> = ({ displays, useData }) => {
  const record = useData()

  return (
    <Grid container spacing={2}>
      {displays.map((display) => (
        <Grid key={display.key} spacing={2} container item>
          <Grid
            item
            xs={1.5}
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
          >
            <span css={styles.label}>{display.label}</span>
          </Grid>
          <Grid item xs={10.5}>
            {display.render({ record })}
          </Grid>
        </Grid>
      ))}
    </Grid>
  )
}
