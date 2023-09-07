export interface PartialHasOneRelationship {
  type: "hasOne"
  targetSchema: string | null
  targetAttribute: string | null
}

export interface FinalHasOneRelationship {
  type: "hasOne"
  targetSchema: string
  targetAttribute: string
}
