/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ModelAttributes } from "sequelize"
import {
  DataTypes,
  // Model,
  // Sequelize,
  // InferAttributes,
  // InferCreationAttributes,
  // ModelStatic,
  // ModelCtor
} from "sequelize"
// const _seqModelSymbol = Symbol("underlying-sequelize-model");

interface ScaffoldModelDefinition {
  attributes: ModelAttributes
  name: string
}

// type InferModel<T extends Model<any, any>> = Model<
//   InferAttributes<T>,
//   InferCreationAttributes<T>
// >

// interface ScaffoldModel<T extends InferModel<T>>
//   extends ScaffoldModelDefinition {
//   // eslint-disable-next-line @typescript-eslint/ban-types
//   findAll: ModelCtor<T>['findAll']
//   findOne: ModelCtor<T>['findOne']
//   create: ModelCtor<T>['create']
//   update: ModelCtor<T>['update']
//   destroy: ModelCtor<T>['destroy']
// }

export const Skill: ScaffoldModelDefinition = {
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
  },
}

// I dont really want to have to define this interface.
// I want it to figure these properties out via the Definition only...
// interface SkillModel extends InferModel<SkillModel> {
//   id: string
//   name: string
// }

// const sequelize = new Sequelize('sqlite::memory:', {
//   logging: false
// })

// function createModel<
//   Q extends Model<any, any>,
//   T extends ScaffoldModelDefinition = ScaffoldModelDefinition
// >(modeldef: T): ScaffoldModel<Q> {
//   const temp = sequelize.define<Q>(modeldef.name, modeldef.attributes);

//   const model: ScaffoldModel<Q> = {
//     name: modeldef.name,
//     attributes: modeldef.attributes,
//     findAll: temp.findAll,
//     findOne: temp.findOne,
//     create: temp.create,
//     update: temp.update,
//     destroy: temp.destroy,
//   };

//   return model;
// }

// const TestSkillModel = createModel<SkillModel>(Skill)

// These attributes, I assume, should be typechecked based on the actual property names in SkillModel or Skill definitions
const result = null // TestSkillModel.findAll({ attributes: ["name", "id", "fish"] });
console.log(result)

function pickObjectKeys<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
) {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key]
    }
  }
  return result
}

const language = {
  name: "TypeScript",
  age: 8,
  extensions: ["ts", "tsx"],
}

const ageAndExtensions = pickObjectKeys(language, ["age", "extensions"])
console.log(ageAndExtensions)
