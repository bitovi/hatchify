import "@testing-library/jest-dom"
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { getEmptyList } from "./hatchifyDisplays"
import {
  HatchifyList,
  HatchifyEmptyList,
  HatchifyAttributeDisplay,
  HatchifyExtraColumn,
} from "../../components"

const testComponents = {
  Test: {
    List: (props) => <HatchifyList {...props} />,
    EmptyList: (props) => <HatchifyEmptyList {...props} />,
    ExtraColumn: (props) => <HatchifyExtraColumn {...props} />,
    AttributeDisplay: (props) => <HatchifyAttributeDisplay {...props} />,
  },
}
describe("hatchifyjs/services/hatchifyDisplays", () => {
  describe("getEmptyList", () => {
    const TestEmpty = testComponents.Test.EmptyList
    it("works", async () => {
      const emptyDefault = getEmptyList(<TestEmpty />)

      render(emptyDefault())
      expect(
        await screen.findByText("There are no rows of data to display"),
      ).toBeInTheDocument()
    })

    it("overrides default empty list when children are passed in", async () => {
      const emptyDefault = getEmptyList(
        <TestEmpty>
          <div>So empty inside</div>
        </TestEmpty>,
      )

      render(emptyDefault())
      expect(await screen.findByText("So empty inside")).toBeInTheDocument()
    })
  })
})
