export interface PartialBelongsToRelationship<
  TTargetSchema extends string | undefined,
> {
  type: "belongsTo"
  targetSchema: TTargetSchema
  sourceAttribute: string | null
  targetAttribute: string | null
}

export interface FinalBelongsToRelationship {
  type: "belongsTo"
  targetSchema: string
  sourceAttribute: string
  targetAttribute: string
}
