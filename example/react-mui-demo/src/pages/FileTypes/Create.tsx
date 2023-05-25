import { useNavigate } from "react-router-dom"
import {HatchifyFormPage} from "@hatchifyjs/react-ui"
import { FileType } from "../../types"

const Create: React.FC = () => {
  const navigate = useNavigate()

  return (
    <HatchifyFormPage
      schema={FileType}
      routeOnSuccess={() => navigate("/fileTypes")}
    />
  )
}

export default Create
