export interface PartialBelongsToRelationship {
  type: "belongsTo"
  targetSchema: string | null
  sourceAttribute: string | null
}

export interface FinalBelongsToRelationship {
  type: "belongsTo"
  targetSchema: string
  sourceAttribute: string
}
