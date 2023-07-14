import { useNavigate } from "react-router-dom"
import { Button } from "@mui/material"
import { HatchifyExtraColumn, HatchifyListPage } from "@hatchifyjs/react-ui"
import { User } from "../../types"

const List: React.FC = () => {
  const navigate = useNavigate()

  return (
    <HatchifyListPage
      schema={User}
      renderActions={() => {
        return (
          <Button variant="contained" onClick={() => navigate("/users/add")}>
            Create
          </Button>
        )
      }}
    >
      <HatchifyExtraColumn
        label="Actions"
        render={({ record }) => {
          return (
            <Button onClick={() => navigate(`/users/${record.id}`)}>
              Details
            </Button>
          )
        }}
      />
    </HatchifyListPage>
  )
}

export default List
