import { DataTypes } from "@hatchifyjs/node"
import type { HatchifyModel } from "@hatchifyjs/node"

export const Project: HatchifyModel = {
  name: "Project",
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
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    noOfRoles: {
      type: DataTypes.VIRTUAL(DataTypes.INTEGER),
      include: ["roles.skills"],
      get() {
        return this.roles && this.roles.length
      },
    },
  },
  hasMany: [{ target: "Role", options: { as: "roles" } }],
  belongsToMany: [
    {
      target: "Assignment",
      options: { as: "assignments", through: { model: "Role" } },
    },
  ],
}
