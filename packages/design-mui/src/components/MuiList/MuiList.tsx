/** @jsxImportSource @emotion/react */
import type { XCollectionProps } from "@hatchifyjs/react-ui"
import { css } from "@emotion/react"
import { Table, TableContainer } from "@mui/material"
import { useCompoundComponents } from "@hatchifyjs/react-ui"
import { MuiBody, MuiHeaders } from "./components"
import type { GetSchemaNames } from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"

const styles = {
  table: css`
    background-color: white;
  `,
}

// export const MuiList: React.FC<XCollectionProps> = (props) => {
export function MuiList<
  const TSchemas extends Record<string, PartialSchema> = any,
  const TSchemaNames extends GetSchemaNames<TSchemas> = any,
>(props: XCollectionProps<TSchemas, TSchemaNames>): JSX.Element {
  const { columns, Empty } = useCompoundComponents(
    props.finalSchemas[props.schemaName],
    props.children,
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
