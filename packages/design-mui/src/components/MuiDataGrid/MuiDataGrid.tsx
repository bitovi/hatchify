import type { XCollectionProps } from "@hatchifyjs/react-ui"
import MuiPagination from "../MuiPagination/MuiPagination"
import MuiList from "../MuiList/MuiList"
import { MuiFilter } from "../MuiFilter"

const MuiDataGrid: React.FC<XCollectionProps> = ({ children, ...props }) => {
  return (
    <div>
      <MuiFilter {...props} />
      <MuiList {...props}>{children}</MuiList>
      <MuiPagination {...props} />
    </div>
  )
}

export default MuiDataGrid
