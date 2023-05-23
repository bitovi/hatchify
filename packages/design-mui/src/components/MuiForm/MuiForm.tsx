/** @jsxImportSource @emotion/react */
import { Fragment } from "react"
import { Box, Button, Grid } from "@mui/material"
import { css } from "@emotion/react"

import type { XFormProps } from "@hatchifyjs/react"

const styles = {
  box: css`
    padding: 10px 0px;
    margin: 15px;
  `,
  label: css`
    font-weight: bold;
  `,
}

export const MuiForm: React.FC<XFormProps> = ({
  isEdit,
  fields,
  formState,
  onUpdateField,
  onSave,
}) => {
  return (
    <Box css={styles.box}>
      <Grid container spacing={2}>
        {fields.map((field) => (
          <Fragment key={field.key}>
            <Grid item xs={12}>
              {field.render({
                value: formState[field.key],
                label: field.label,
                onUpdate: (value) =>
                  onUpdateField({
                    key: field.key,
                    value,
                    attributeSchema: field.attributeSchema,
                  }),
              })}
            </Grid>
          </Fragment>
        ))}
        <Grid item>
          <Button variant="contained" onClick={onSave}>
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}
