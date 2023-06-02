import { useNavigate } from "react-router-dom"
import {HatchifyFormPage} from "@hatchifyjs/react-ui"
import { Document } from "../../types";

const Create: React.FC = () => {
  const navigate = useNavigate()

  return (
    <HatchifyFormPage
      schema={Document}
      routeOnSuccess={() => navigate("/documents")}
    />
  )
}

export default Create
