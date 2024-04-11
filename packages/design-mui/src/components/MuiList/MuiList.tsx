/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react"
import type { XDataGridProps } from "@hatchifyjs/react-ui"
import { Table, TableContainer } from "@mui/material"
import { useCompoundComponents } from "@hatchifyjs/react-ui"
import { MuiBody, MuiHeaders } from "./components/index.js"
import type { GetSchemaNames } from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"

export function MuiList<
  const TSchemas extends Record<string, PartialSchema> = any,
  const TSchemaName extends GetSchemaNames<TSchemas> = any,
>(props: XDataGridProps<TSchemas, TSchemaName>): JSX.Element {
  const [height, setHeight] = useState<string | number>(
    props.fitParent ? "100%" : "auto",
  )

  const { columns, Empty } = useCompoundComponents(
    props.finalSchemas,
    props.schemaName,
    props.overwrite ?? false,
    props.children,
    props.include,
  )

  useEffect(() => {
    if (!props.fitParent || !props.listWrapperId) {
      return
    }

    const wrapperElement = document.getElementById(props.listWrapperId)

    if (!wrapperElement) {
      return
    }

    const resizeObserver = new ResizeObserver((event) => {
      setHeight(event[0].contentBoxSize[0].blockSize)
    })

    resizeObserver.observe(wrapperElement)

    return () => resizeObserver.disconnect()
  }, [props.listWrapperId])

  return (
    <TableContainer style={{ maxHeight: height }}>
      <Table stickyHeader>
        <MuiHeaders {...props} columns={columns} />
        <MuiBody {...props} columns={columns} Empty={Empty} />
      </Table>
    </TableContainer>
  )
}

export default MuiList
