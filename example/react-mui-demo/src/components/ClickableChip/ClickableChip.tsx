import { useNavigate } from "react-router-dom"
import { Chip } from "@mui/material"
import type {
  Relationship,
  ValueComponent,
} from "@hatchifyjs/react-ui"

const attributeToPath: { [key: string]: string } = {
  category: "categories",
  fileType: "fileTypes",
  user: "users",
}

const ClickableChip: ValueComponent = ({ attribute, value }) => {
  const navigate = useNavigate()

  return (
    <Chip
      label={(value as Relationship).label}
      onClick={() =>
        navigate(
          `/${attributeToPath[attribute as string]}/${
            (value as Relationship).id
          }`,
        )
      }
    />
  )
}

export default ClickableChip
