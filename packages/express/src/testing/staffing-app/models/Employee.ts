import { DataTypes } from "@hatchifyjs/node"
import type { HatchifyModel } from "@hatchifyjs/node"

export const Employee: HatchifyModel = {
  name: "Employee",
  attributes: {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: ["^[a-z].*?$", "i"],
      },
    },
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    currentProject: {
      type: DataTypes.VIRTUAL(DataTypes.INTEGER),
      include: ["assignments.role.project"],
      get() {
        if (this.assignments) {
          const project = this.assignments.find((assignment) => {
            const now = new Date()
            return (
              new Date(assignment?.role.start_date) < now &&
              new Date(assignment?.role.end_date) > now
            )
          })?.role?.project
          if (!project) return null
          return {
            id: project.id,
            name: project.name,
          }
        }
        return null
      },
    },
  },
  hasMany: [{ target: "Assignment", options: { as: "assignments" } }],
  belongsToMany: [
    { target: "Skill", options: { through: "employee__skill", as: "skills" } },
  ],
}

/*
-- public.employee definition

-- Drop table

-- DROP TABLE employee;

CREATE TABLE employee (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    "name" varchar(255) NOT NULL,
    start_date date NULL,
    end_date date NULL,
    CONSTRAINT employee_pkey PRIMARY KEY (id)
);
*/
