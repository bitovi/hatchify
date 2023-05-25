import { useNavigate } from "react-router-dom"
import {HatchifyFormPage} from "@hatchifyjs/react-ui"
import { Category } from "../../types"

const Create: React.FC = () => {
  const navigate = useNavigate()

  return (
    <HatchifyFormPage
      schema={Category}
      routeOnSuccess={() => navigate("/categories")}
    />
  )
}

export default Create
