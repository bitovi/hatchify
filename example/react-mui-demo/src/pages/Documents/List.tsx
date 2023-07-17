import { useNavigate } from "react-router-dom"
import { Button, Link } from "@mui/material"

import {
  HatchifyAttributeDisplay,
  HatchifyExtraColumn,
  HatchifyListPage,
} from "@hatchifyjs/react-ui"
import type { Render } from "@hatchifyjs/react-ui"

import { Document } from "../../types"
import ClickableChip from "../../components"

const List: React.FC = () => {
  const navigate = useNavigate()

  return (
    <HatchifyListPage
      schema={Document}
      renderActions={() => {
        return (
          <Button
            variant="contained"
            onClick={() => navigate("/documents/add")}
          >
            Create
          </Button>
        )
      }}
    >
      <HatchifyAttributeDisplay label="ID" attribute="id" />
      <HatchifyAttributeDisplay label="Title" attribute="title" />
      <HatchifyAttributeDisplay label="Date" attribute="date" />
      <HatchifyAttributeDisplay
        label="Category"
        attribute="category"
        ValueComponent={ClickableChip}
      />
      <HatchifyAttributeDisplay
        label="File Type"
        attribute="fileType"
        ValueComponent={ClickableChip}
      />
      <HatchifyAttributeDisplay
        label="Uploaded By"
        attribute="user"
        ValueComponent={ClickableChip}
      />
      <HatchifyExtraColumn
        label="Actions"
        render={({ record }) => <ListActions record={record} />}
      />
    </HatchifyListPage>
  )
}

export default List

const ListActions: Render = ({ record }) => {
  const navigate = useNavigate()
  const url = record.url as string

  return (
    <>
      <Button component={Link} href={url} target="_blank">
        View
      </Button>
      <Button component={Link} href={url} download>
        Download
      </Button>
      <Button onClick={() => navigate(`/documents/${record.id}`)}>
        Details
      </Button>
    </>
  )
}
