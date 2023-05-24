import * as inflection from "inflection"
import { Attributes, ModelStatic, Transaction, UpdateOptions } from "sequelize"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Scaffold } from "../.."
import { IAssociation, IAssociationBody } from "../types"

export const handleUpdateBelongs = async (
  model: ModelStatic<any>,
  ops: Omit<UpdateOptions<Attributes<any>>, "returning"> & {
    returning: Exclude<
      UpdateOptions<Attributes<any>>["returning"],
      undefined | false
    >
  },
  origUpdate: any,
  currentModelAttributes: Attributes<any>,
  belongsAssociation: Array<string>,
  associations: Record<string, IAssociation>,
  attributes: Attributes<any>,
  transaction: Transaction,
  primaryKey = "id",
) => {
  const updatedModelAttributes = currentModelAttributes
  belongsAssociation.forEach((association) => {
    const associationDetails = associations[association]
    const associationAttribute = attributes[association]
    const key = associationDetails.key
    updatedModelAttributes[key] = associationAttribute?.[primaryKey]
  })
  return origUpdate.apply(model, [
    updatedModelAttributes,
    { ...ops, transaction },
  ])
}

export const handleUpdateOne = async (
  scaffold: Scaffold,
  association: IAssociationBody<Array<Record<string, any>>>,
  model: { name: string; id: string },
  transaction: Transaction,
  primaryKey = "id",
) => {
  const key = association.details.key

  await scaffold.model[association.details.model].update(
    association.attributes,
    {
      where: {
        [key]: model[primaryKey],
      },
      transaction,
    },
  )
}

export const handleUpdateMany = async (
  scaffold: Scaffold,
  association: IAssociationBody<Array<Record<string, any>>>,
  model: { name: string; id: string },
  transaction: Transaction,
  primaryKey = "id",
) => {
  const modelInstance = await scaffold.model[model.name].findByPk(
    model[primaryKey],
  )
  if (!modelInstance) {
    return
  }
  const joinIds: Array<string> = association.attributes.map(
    (data) => data[primaryKey],
  )
  if (joinIds.length === 0) return
  const modelNameInPlural = inflection.pluralize(association.details.model)
  return await modelInstance[`set${modelNameInPlural}`](joinIds, {
    transaction,
  })
}
