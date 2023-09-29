export interface PartialBelongsToRelationship {
  type: "belongsTo"
  targetSchema: string | null
  sourceAttribute: string | null
  targetAttribute: string | null
}

export interface FinalBelongsToRelationship {
  type: "belongsTo"
  targetSchema: string
  sourceAttribute: string
  targetAttribute: string
}
