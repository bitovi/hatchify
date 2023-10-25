import type {
  PartialHasManyThroughRelationship,
  ThroughOrAttributes,
} from "../hasManyThrough/types"

export interface PartialHasManyRelationship<
  TTargetSchema extends string | undefined | null,
> {
  type: "hasMany"
  targetSchema: TTargetSchema
  targetAttribute: string | null
  sourceAttribute: string | null
  through: (
    throughOrAttributes?: ThroughOrAttributes,
  ) => PartialHasManyThroughRelationship
}

export interface FinalHasManyRelationship {
  type: "hasMany"
  targetSchema: string
  targetAttribute: string
  sourceAttribute: string
}
