import type { ScaffoldModel } from "../../../types"
import { DataTypes } from "../../../types"

export const Role: ScaffoldModel = {
  name: "Role",
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
    end_date: {
      type: DataTypes.DATE,
    },
    start_confidence: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    end_confidence: {
      type: DataTypes.FLOAT,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  hasMany: [
    {
      target: "Assignment",
      options: { as: "assignments", foreignKey: "id", keyType: DataTypes.UUID },
    },
  ],
  belongsTo: [
    { target: "Project", options: { as: "project", foreignKey: "project_id" } },
  ],
  belongsToMany: [
    {
      target: "Employee",
      options: { through: "role__employee", as: "employees" },
    },
    { target: "Skill", options: { through: "role__skill", as: "skills" } },
  ],
}

/*

-- public."role" definition

-- Drop table

-- DROP TABLE "role";

CREATE TABLE "role" (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    start_date date NOT NULL,
    start_confidence float4 NOT NULL,
    end_date date NULL,
    end_confidence float4 NULL,
    project_id uuid NOT NULL,
    CONSTRAINT role_pkey PRIMARY KEY (id)
);
CREATE INDEX role_project_id_index ON public.role USING btree (project_id);


-- public."role" foreign keys

ALTER TABLE public."role" ADD CONSTRAINT role_project_id_foreign FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE ON UPDATE CASCADE;
*/
