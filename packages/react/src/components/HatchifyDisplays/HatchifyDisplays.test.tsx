import { render } from "@testing-library/react"
import {
  HatchifyExtraDisplay,
  HatchifyAttributeDisplay
} from "./HatchifyDisplays"

describe.skip("hatchifyjs/components/HatchifyColumns", () => {
  describe.skip("HatchifyExtraDisplay", () => {
    it("works", () => {
      render(<HatchifyExtraDisplay label="Label" render={() => <div />} />)
    })
  })

  describe.skip("HatchifyAttributeDisplay", () => {
    it("works", () => {
      render(<HatchifyAttributeDisplay attribute="field" />)
    })
  })

  // describe.skip("HatchifyAttributeField", () => {
  //   it("works", () => {
  //     render(<HatchifyAttributeField attribute="field" render={jest.fn()} />)
  //   })
  // })
})
