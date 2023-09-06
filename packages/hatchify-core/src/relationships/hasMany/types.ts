import type {
  PartialHasManyThroughRelationship,
  ThroughOrAttributes,
} from "../hasManyThrough/types"

export interface PartialHasManyRelationship {
  type: "hasMany"
  targetSchema: string | null
  targetAttribute: string | null
  through: (
    throughOrAttributes?: ThroughOrAttributes,
  ) => PartialHasManyThroughRelationship
}

export interface FinalHasManyRelationship {
  type: "hasMany"
  targetSchema: string
  targetAttribute: string
}
