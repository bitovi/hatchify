/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { Pagination } from "@mui/material"
import type { XDataGridProps } from "@hatchifyjs/react-ui"

const styles = {
  pagination: css`
    margin-top: 5px;
    ul {
      justify-content: flex-end;
    }
  `,
}

const MuiPagination: React.FC<XDataGridProps> = ({ meta, page, setPage }) => {
  const count = meta?.meta?.unpaginatedCount
    ? Math.ceil(meta.meta.unpaginatedCount / page.size)
    : 1

  return (
    <Pagination
      disabled={meta?.isPending}
      css={styles.pagination}
      count={count}
      page={page.number}
      shape="rounded"
      variant="outlined"
      onChange={(ev: React.ChangeEvent<unknown>, value: number) =>
        setPage({ ...page, number: value })
      }
    />
  )
}

export default MuiPagination
