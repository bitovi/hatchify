import type { HatchifyModelV2 as Schema } from "./HatchifySchema"

describe("HatchifySchemaV2", () => {
  const EmployeeSchema: Schema = {
    name: "Employee",
    displayAttribute: "name",
    id: {
      type: "UUID",
      defaultValue: "UUIDV4",
    },
    attributes: {
      name: {
        type: "string",
        validation: {
          optional: false, // default
          minLength: 5,
        },
        sequelize: {
          type: "VARCHAR(255)",
        },
      },
      start_date: "date",
      end_date: "date",
    },
    relationships: {
      roles: {
        type: "many", // or "one"
        schema: "Role",
        through: "role__employee",
      },
      skills: {
        type: "many",
        schema: "Skill",
        through: "skill__employee",
      },
    },
    validation: {
      startDateBeforeEndDate1: {
        type: "less-than",
        lhs: "start_date",
        rhs: "end_date",
      },
      startDateBeforeEndDate2: {
        type: "custom",
        fields: ["start_date", "end_date"],
        validate: ([lhs, rhs], record) => {
          if (!record[lhs] || !record[rhs]) return true
          if (record[lhs] < record[rhs]) return true
          return {
            fields: [lhs, rhs],
            message: "The value of $1 must be less than $2.",
          }
        },
      },
    },
  }

  const SkillSchema: Schema = {
    name: "Skill",
    displayAttribute: "name",
    attributes: {
      name: {
        type: "string",
      },
    },
    relationships: {
      employees: {
        type: "many",
        schema: "Employee",
        through: "skill__employee",
      },
    },
  }

  const RoleSchema: Schema = {
    name: "Role",
    displayAttribute: "name",
    attributes: {
      name: {
        type: "string",
        virtual: true,
        fields: ["start_date", "end_date"],
        value: ([start_date, end_date]) =>
          `${start_date.toLocaleDateString()} to ${end_date.toLocaleDateString()}`,
      },
      start_date: "date",
      end_date: "date",
    },
    relationships: {
      // project: ...
      employee: {
        type: "one",
        schema: "Employee",
        through: "role__employee",
      },
    },
  }

  it("works", () => {
    expect(EmployeeSchema).toBeTruthy()
    expect(SkillSchema).toBeTruthy()
    expect(RoleSchema).toBeTruthy()
  })
})
