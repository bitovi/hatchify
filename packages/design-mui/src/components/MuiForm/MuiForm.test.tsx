import { describe, it, vi, expect } from "vitest"

import { render, screen } from "@testing-library/react"
import {MuiForm} from "./MuiForm"

describe("hatchifyjs/presentation/mui/MuiForm", () => {
  describe("MuiForm", () => {
    it("works", async () => {
      render(
        <MuiForm
          isEdit={false}
          onUpdateField={vi.fn()}
          onSave={vi.fn()}
          formState={{ name: "" }}
          fields={[
            {
              key: "name",
              label: "Name",
              attributeSchema: { type: "string", allowNull: false },
              render: () => (
                <label>
                  Name:
                  <input type="text" />
                </label>
              ),
            },
          ]}
        />,
      )
      expect(await screen.findByText("Name:")).toBeDefined()
    })
  })
})
