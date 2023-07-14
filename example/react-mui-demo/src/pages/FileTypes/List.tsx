import { useNavigate } from "react-router-dom"
import { Button } from "@mui/material"
import { HatchifyExtraColumn, HatchifyListPage } from "@hatchifyjs/react-ui"
import { FileType } from "../../types"

const List: React.FC = () => {
  const navigate = useNavigate()

  return (
    <HatchifyListPage
      schema={FileType}
      renderActions={() => {
        return (
          <Button
            variant="contained"
            onClick={() => navigate("/fileTypes/add")}
          >
            Create
          </Button>
        )
      }}
    >
      <HatchifyExtraColumn
        label="Actions"
        render={({ record }) => {
          return (
            <Button onClick={() => navigate(`/fileTypes/${record.id}`)}>
              Details
            </Button>
          )
        }}
      />
    </HatchifyListPage>
  )
}

export default List
