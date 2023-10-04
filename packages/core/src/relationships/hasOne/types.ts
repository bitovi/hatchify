export interface PartialHasOneRelationship {
  type: "hasOne"
  targetSchema: string | null
  targetAttribute: string | null
  sourceAttribute: string | null
}

export interface FinalHasOneRelationship {
  type: "hasOne"
  targetSchema: string
  targetAttribute: string
  sourceAttribute: string
}
