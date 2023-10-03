import { describe, expect, it } from "vitest"
import { getEndpoint } from "./schema"

describe("rest-client-jsonapi/services/utils/schema", () => {
  describe("getEndpoint", () => {
    it("works", () => {
      // with endpoint
      expect(getEndpoint("employees", undefined, "People", "Person")).toEqual(
        "employees",
      )
      expect(getEndpoint("employees", undefined, undefined, "Person")).toEqual(
        "employees",
      )
      expect(getEndpoint("employees", "Admin", undefined, "Person")).toEqual(
        "employees",
      )

      // with namespace
      expect(
        getEndpoint(undefined, "Admin", undefined, "Admin_Person"),
      ).toEqual("admin/persons")
      expect(getEndpoint(undefined, "Admin", "People", "Admin_Person")).toEqual(
        "admin/people",
      )
      expect(
        getEndpoint(undefined, "Admin", "EmployedPeople", "Admin_Person"),
      ).toEqual("admin/employed-people")
      expect(
        getEndpoint(undefined, "Admin", undefined, "Admin_EmployedPerson"),
      ).toEqual("admin/employed-persons")

      // with pluralName
      expect(getEndpoint(undefined, undefined, "People", "Person")).toEqual(
        "people",
      )
      expect(
        getEndpoint(undefined, undefined, "EmployedPeople", "Person"),
      ).toEqual("employed-people")

      // without endpoint, namespace, or pluralName
      expect(
        getEndpoint(undefined, undefined, undefined, "EmployedPerson"),
      ).toEqual("employed-persons")
      expect(
        getEndpoint(undefined, undefined, undefined, "EmployedPersons"),
      ).toEqual("employed-personss")
      expect(getEndpoint(undefined, undefined, undefined, "People")).toEqual(
        "peoples",
      )
    })
  })
})
