export interface PartialHasManyThroughRelationship<
  TTargetSchema extends string | undefined | null,
> {
  type: "hasManyThrough"
  targetSchema: TTargetSchema
  // The name of the join table
  through: string | null
  // An attribute on the "join" schema pointing to the Source schema
  throughSourceAttribute: string | null
  // An attribute on the "join" schema pointing to the Target schema
  throughTargetAttribute: string | null
  sourceKey?: string | null
  targetKey?: string | null
}

export interface FinalHasManyThroughRelationship {
  type: "hasManyThrough"
  targetSchema: string
  // The name of the join table
  through: string
  // An attribute on the "join" schema pointing to the Source schema
  throughSourceAttribute: string
  // An attribute on the "join" schema pointing to the Target schema
  throughTargetAttribute: string
  sourceKey?: string
  targetKey?: string
}

export type ThroughOptions =
  | { throughSourceAttribute: string; throughTargetAttribute: string }
  | { targetKey: string; sourceKey: string }
