import { ScaffoldModel, DataTypes } from "../../../types"

export const Skill: ScaffoldModel = {
  name: "Skill",
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
      unique: true,
    },
    vname: {
      type: DataTypes.VIRTUAL(DataTypes.INTEGER),
      get() {
        return this.name
      },
    },
  },
  belongsToMany: [
    { target: "Role", options: { through: "role__skill", as: "roles" } },
  ],
}

/*
-- public.skill definition

-- Drop table

-- DROP TABLE skill;

CREATE TABLE skill (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    "name" varchar(255) NULL,
    CONSTRAINT skill_name_unique UNIQUE (name),
    CONSTRAINT skill_pkey PRIMARY KEY (id)
);
*/
