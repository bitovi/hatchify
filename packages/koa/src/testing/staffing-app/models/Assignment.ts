import { DataTypes } from "@hatchifyjs/node"
import type { HatchifyModel } from "@hatchifyjs/node"

export const Assignment: HatchifyModel = {
  name: "Assignment",
  attributes: {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: DataTypes.DATE,
  },
  belongsTo: [
    {
      target: "Role",
      options: { as: "role", foreignKey: "role_id", keyType: DataTypes.UUID },
    },
    {
      target: "Employee",
      options: {
        as: "employee",
        foreignKey: "employee_id",
        keyType: DataTypes.UUID,
      },
    },
  ],
  belongsToMany: [
    {
      target: "Project",
      options: { as: "projects", through: "Role" },
    },
  ],
}

/*
-- public."assignment" definition

-- Drop table

-- DROP TABLE "assignment";

CREATE TABLE "assignment" (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    employee_id uuid NOT NULL,
    role_id uuid NOT NULL,
    start_date date NOT NULL,
    end_date date NULL,
    CONSTRAINT assignment_pkey PRIMARY KEY (id)
);
CREATE INDEX assignment_employee_id_index ON public.assignment USING btree (employee_id);
CREATE INDEX assignment_role_id_index ON public.assignment USING btree (role_id);


-- public."assignment" foreign keys

ALTER TABLE public."assignment" ADD CONSTRAINT assignment_employee_id_foreign FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public."assignment" ADD CONSTRAINT assignment_role_id_foreign FOREIGN KEY (role_id) REFERENCES "role"(id) ON DELETE CASCADE ON UPDATE CASCADE;

*/
