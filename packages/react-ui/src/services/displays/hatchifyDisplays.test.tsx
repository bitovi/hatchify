import "@testing-library/jest-dom"
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  getEmptyList,
  getDisplays,
  injectExtraDisplays,
} from "./hatchifyDisplays"
import type { Schema } from "@hatchifyjs/rest-client"
import {
  HatchifyList,
  HatchifyEmptyList,
  HatchifyAttributeDisplay,
  HatchifyExtraColumn,
  HatchifyPresentationDefaultValueComponents,
} from "../../components"

const TestSchema: Schema = {
  name: "Test",
  attributes: { id: "string", name: "string" },
  displayAttribute: "name",
}

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

  //TODO: @arthur plz fix these guys
  describe.skip("getDisplays", () => {
    it("works", async () => {
      const TestList = testComponents.Test.List
      const TestExtraColumn = testComponents.Test.ExtraColumn

      const displays = getDisplays(
        TestSchema,
        undefined,
        HatchifyPresentationDefaultValueComponents,
        <TestList>
          <TestExtraColumn
            label="Action"
            render={({ record }) => {
              return (
                <>
                  <button onClick={() => console.log(record)}>Download</button>
                </>
              )
            }}
          />
        </TestList>,
      )

      expect(await displays).toEqual([
        {
          key: "id",
          label: "Id",
          render: () => vi.fn(),
        },
        {
          key: "name",
          label: "Name",
          render: () => vi.fn(),
        },
      ])
    })
  })

  describe.skip("injectExtraDisplays", () => {
    it("works", async () => {
      const TestExtraColumn = testComponents.Test.ExtraColumn

      const displays = injectExtraDisplays(
        [
          {
            key: "id",
            label: "Id",
            render: () => vi.fn(),
          },
          {
            key: "name",
            label: "Name",
            render: () => vi.fn(),
          },
        ],
        HatchifyPresentationDefaultValueComponents,
        <TestExtraColumn
          label="Action"
          render={({ record }) => {
            return (
              <>
                <button onClick={() => console.log(record)}>Download</button>
              </>
            )
          }}
        />,
      )
      expect(await displays).toEqual([
        {
          key: "id",
          label: "Id",
          render: () => vi.fn(),
        },
        {
          key: "name",
          label: "Name",
          render: () => vi.fn(),
        },
        {
          key: "Action",
          label: "Action",
          render: () => vi.fn(),
        },
      ])
    })
  })
})
