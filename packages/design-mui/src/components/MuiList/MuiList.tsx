/** @jsxImportSource @emotion/react */
import type { XCollectionProps } from "@hatchifyjs/react-ui"
import { css } from "@emotion/react"
import { Table, TableContainer } from "@mui/material"
import { useCompoundComponents } from "@hatchifyjs/react-ui"
import { MuiBody, MuiHeaders } from "./components"

const styles = {
  tableContainer: css`
    padding: 15px;
    box-sizing: border-box;
  `,
  table: css`
    background-color: white;
  `,
}

export const MuiList: React.FC<XCollectionProps> = (props) => {
  const { columns, Empty } = useCompoundComponents(
    props.allSchemas[props.schemaName],
    props.children,
  )

  return (
    <TableContainer css={styles.tableContainer}>
      <Table css={styles.table}>
        <MuiHeaders {...props} columns={columns} />
        <MuiBody {...props} columns={columns} Empty={Empty} />
      </Table>
    </TableContainer>
  )
}

export default MuiList
