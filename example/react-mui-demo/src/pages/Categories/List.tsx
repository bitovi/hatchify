import { useNavigate } from "react-router-dom"
import { Button } from "@mui/material"
import { HatchifyListPage, HatchifyExtraColumn } from "@hatchifyjs/react-ui"
import { Category } from "../../types"

const List: React.FC = () => {
  const navigate = useNavigate()

  return (
    <HatchifyListPage
      schema={Category}
      renderActions={() => {
        return (
          <Button
            variant="contained"
            onClick={() => navigate("/categories/add")}
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
            <Button onClick={() => navigate(`/categories/${record.id}`)}>
              Details
            </Button>
          )
        }}
      />
    </HatchifyListPage>
  )
}

export default List
