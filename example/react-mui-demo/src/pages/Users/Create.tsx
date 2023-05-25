import { useNavigate } from "react-router-dom"
import {HatchifyFormPage} from "@hatchifyjs/react-ui"
import { User } from "../../types"

const Create: React.FC = () => {
  const navigate = useNavigate()

  return (
    <HatchifyFormPage schema={User} routeOnSuccess={() => navigate("/users")} />
  )
}

export default Create
