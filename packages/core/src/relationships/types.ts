import type {
  FinalBelongsToRelationship,
  PartialBelongsToRelationship,
} from "./belongsTo/types"
import type {
  FinalHasManyRelationship,
  PartialHasManyRelationship,
} from "./hasMany/types"
import type {
  FinalHasManyThroughRelationship,
  PartialHasManyThroughRelationship,
} from "./hasManyThrough/types"
import type {
  FinalHasOneRelationship,
  PartialHasOneRelationship,
} from "./hasOne/types"

// @todo HATCH-417
export type PartialRelationship =
  // @ts-expect-error
  | PartialBelongsToRelationship
  // @ts-expect-error
  | PartialHasManyRelationship
  // @ts-expect-error
  | PartialHasOneRelationship
  | PartialHasManyThroughRelationship

export type FinalRelationship =
  | FinalBelongsToRelationship
  | FinalHasManyRelationship
  | FinalHasOneRelationship
  | FinalHasManyThroughRelationship
