/* eslint-disable @typescript-eslint/no-explicit-any */
import { Attributes, ModelStatic, Transaction } from "sequelize"
import { Scaffold } from "../.."
import { JSONAnyObject } from "../../types"
import { IAssociation } from "../types"
import { handleUpdateMany, handleUpdateOne } from "./sequelize.patch"
import {
  handleBulkCreateMany,
  handleCreateHasOne,
  handleCreateMany,
} from "./sequelize.post"

export const getValidAttributesAndAssociations = (
  attributes: Attributes<any> | Array<Attributes<any>>,
  associations: Record<string, IAssociation> | undefined,
) => {
  const belongsAssociation: Array<string> = [] // the total no of associations that the current model Belongs to
  const externalAssociations: Array<string> = [] // this associations do not belong in the current model.
  let currentModelAttributes = attributes
  const otherAssociationAttributes: JSONAnyObject = {}

  if (associations) {
    const associationsKeys = Object.keys(associations)
    const attributeKeys = Array.isArray(currentModelAttributes)
      ? Object.keys(attributes[0])
      : Object.keys(attributes)

    // GET ALL ASSOCIATION ATTRIBUTES AND SEPARATE THEM FROM DATA LEFT
    associationsKeys.forEach((association) => {
      if (attributeKeys.includes(association)) {
        let data: any
        if (Array.isArray(currentModelAttributes)) {
          data = currentModelAttributes.map((attribute: any) => {
            const { [association]: _, ...attributesleft } = attribute
            const otherAttr = otherAssociationAttributes[association] ?? []
            otherAssociationAttributes[association] = [...otherAttr, _]
            return attributesleft
          })
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [association]: _, ...attributesLeft } = currentModelAttributes
          data = attributesLeft
        }
        currentModelAttributes = data
        const associationDetails = associations[association]
        if (associationDetails.type === "belongsTo") {
          belongsAssociation.push(association)
        } else {
          externalAssociations.push(association)
        }
      }
    })
  }

  return {
    otherAssociationAttributes,
    belongsAssociation,
    externalAssociations,
    currentModelAttributes,
  }
}

export const handleCreateAssociations = async (
  scaffold: Scaffold,
  model: ModelStatic<any>,
  validAssociations: Array<string>,
  associations: Record<string, IAssociation>,
  attributes: Attributes<any>,
  transaction: Transaction,
  modelId: string,
  primaryKey = "id",
) => {
  for (const association of validAssociations) {
    const associationDetails = associations[association]
    const associationAttribute = attributes[association]

    switch (associationDetails.type) {
      case "hasOne":
        await handleCreateHasOne(
          scaffold,
          {
            details: associationDetails,
            attributes: associationAttribute,
          },
          { name: model.name, id: modelId },
          transaction,
          primaryKey,
          true,
        )
        break
      case "hasMany":
      case "belongsToMany":
        await handleCreateMany(
          scaffold,
          {
            details: associationDetails,
            attributes: associationAttribute,
          },
          { name: model.name, id: modelId },
          transaction,
          primaryKey,
        )
        break
      default:
        break
    }
  }
}

export const handleBulkCreateAssociations = async (
  scaffold: Scaffold,
  model: ModelStatic<any>,
  validAssociations: Array<string>,
  associations: Record<string, IAssociation>,
  attributes: JSONAnyObject,
  transaction: Transaction,
  modelIds: Array<string>,
  primaryKey = "id",
) => {
  for (const association of validAssociations) {
    const associationDetails = associations[association]
    const associationAttribute = attributes[association]

    switch (associationDetails.type) {
      case "hasOne":
        await handleCreateHasOne(
          scaffold,
          {
            details: associationDetails,
            attributes: associationAttribute,
          },
          { name: model.name, id: modelIds },
          transaction,
          primaryKey,
        )
        break
      case "hasMany":
      case "belongsToMany":
        await handleBulkCreateMany(
          scaffold,
          {
            details: associationDetails,
            attributes: associationAttribute,
          },
          { name: model.name, id: modelIds },
          transaction,
          primaryKey,
        )
        break
      default:
        break
    }
  }
}

export const handleUpdateAssociations = async (
  scaffold: Scaffold,
  model: ModelStatic<any>,
  validAssociations: Array<string>,
  associations: Record<string, IAssociation>,
  attributes: Attributes<any>,
  transaction: Transaction,
  modelId: string,
  primaryKey = "id",
) => {
  for (const association of validAssociations) {
    const associationDetails = associations[association]
    const associationAttribute = attributes[association]

    switch (associationDetails.type) {
      case "hasOne":
        await handleUpdateOne(
          scaffold,
          {
            details: associationDetails,
            attributes: associationAttribute,
          },
          {
            name: model.name,
            id: modelId,
          },
          transaction,
          primaryKey,
        )
        break
      case "hasMany":
      case "belongsToMany":
        await handleUpdateMany(
          scaffold,
          {
            details: associationDetails,
            attributes: associationAttribute,
          },
          {
            name: model.name,
            id: modelId,
          },
          transaction,
          primaryKey,
        )
        break
      default:
        break
    }
  }
}
