export interface PartialHasOneRelationship<
  TTargetSchema extends string | undefined,
> {
  type: "hasOne"
  targetSchema: TTargetSchema
  targetAttribute: string | null
  sourceAttribute: string | null
}

export interface FinalHasOneRelationship {
  type: "hasOne"
  targetSchema: string
  targetAttribute: string
  sourceAttribute: string
}
