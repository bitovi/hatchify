import { describe, it, vi } from "vitest"
import { render } from "@testing-library/react"
import MuiBodySkeleton from "./MuiBodySkeleton"
import type { HatchifyDisplay } from "@hatchifyjs/react-ui"

const columns: HatchifyDisplay[] = [
  {
    sortable: false,
    key: "name",
    label: "name",
    render: vi.fn(),
  },
]
describe("components/MuiBodySkeleton", () => {
  it("works", async () => {
    render(<MuiBodySkeleton columns={columns} />)
  })
})
