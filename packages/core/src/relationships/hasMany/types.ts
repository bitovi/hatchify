import type {
  PartialHasManyThroughRelationship,
  ThroughOptions,
} from "../hasManyThrough/types"

// @todo HATCH-417
export interface PartialHasManyRelationship<
  TTargetSchema extends string | undefined | null,
> {
  type: "hasMany"
  targetSchema: TTargetSchema
  targetAttribute: string | null
  sourceAttribute: string | null
  through: (
    through?: string | null,
    options?: ThroughOptions,
  ) => PartialHasManyThroughRelationship<TTargetSchema>
}

export interface FinalHasManyRelationship {
  type: "hasMany"
  targetSchema: string
  targetAttribute: string
  sourceAttribute: string
}
