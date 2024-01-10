/** @jsxImportSource @emotion/react */
import type { XDataGridProps } from "@hatchifyjs/react-ui"
import { css } from "@emotion/react"
import { Table, TableContainer } from "@mui/material"
import { useCompoundComponents } from "@hatchifyjs/react-ui"
import { MuiBody, MuiHeaders } from "./components/index.js"
import type { GetSchemaNames } from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"

const styles = {
  table: css`
    background-color: white;
  `,
}

export function MuiList<
  const TSchemas extends Record<string, PartialSchema> = any,
  const TSchemaName extends GetSchemaNames<TSchemas> = any,
>(props: XDataGridProps<TSchemas, TSchemaName>): JSX.Element {
  const { columns, Empty } = useCompoundComponents(
    props.finalSchemas,
    props.schemaName,
    props.overwrite ?? false,
    props.children,
    props.include,
  )

  return (
    <TableContainer>
      <Table css={styles.table}>
        <MuiHeaders {...props} columns={columns} />
        <MuiBody {...props} columns={columns} Empty={Empty} />
      </Table>
    </TableContainer>
  )
}

export default MuiList
