import type { XCollectionProps } from "@hatchifyjs/react-ui"
import MuiPagination from "../MuiPagination/MuiPagination"
import MuiList from "../MuiList/MuiList"

const MuiDataGrid: React.FC<XCollectionProps> = ({ children, ...props }) => {
  return (
    <div>
      {/* todo filters */}
      <MuiList {...props}>{children}</MuiList>
      <MuiPagination {...props} />
    </div>
  )
}

export default MuiDataGrid
