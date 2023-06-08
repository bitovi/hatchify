import validateAssignmentOverlap from "./validations/validateAssignmentOverlap"
import validateRoleOverlap from "./validations/validateRoleOverlap"
import { validateStartDate } from "../utils/validation"

const modelBehaviours = (model) => {
  const { Assignment, Employee, Role } = model

  const modelHooks = [
    {
      model: Assignment,
      hooks: [
        async function beforeValidate({ dataValues }) {
          validateStartDate(dataValues)

          await validateRoleOverlap({
            body: dataValues,
            Role,
          })

          await validateAssignmentOverlap({
            body: dataValues,
            Assignment,
          })
        },
      ],
    },
    {
      model: Employee,
      hooks: [
        function beforeValidate({ dataValues }) {
          validateStartDate(dataValues)
        },
      ],
    },
    {
      model: Role,
      hooks: [
        function beforeValidate({ dataValues }) {
          validateStartDate(dataValues)
        },
      ],
    },
  ]

  modelHooks.forEach((modelHook) => {
    modelHook.hooks.forEach((hook) => {
      modelHook.model.addHook(hook.name, hook)
    })
  })
}

export default modelBehaviours
