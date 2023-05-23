/** @jsxImportSource @emotion/react */
import { Chip } from "@mui/material"
import { css } from "@emotion/react"

import type { Relationship as RelationshipType } from "@hatchifyjs/react-ui"

const styles = {
  chip: css`
    margin: 0 2.5px;
    &:first-of-type {
      margin-left: 0;
    }
    &:last-of-type {
      margin-right: 0;
    }
  `,
}

export const Relationship: React.FC<{ value: RelationshipType }> = ({
  value,
}) => <Chip css={styles.chip} label={value.label} />

export const RelationshipList: React.FC<{ values: RelationshipType[] }> = ({
  values,
}) => (
  <>
    {values.map((value) => (
      <Chip key={value.id} css={styles.chip} label={value.label} />
    ))}
  </>
)
