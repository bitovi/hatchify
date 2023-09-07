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

export type PartialRelationship =
  | PartialBelongsToRelationship
  | PartialHasManyRelationship
  | PartialHasOneRelationship
  | PartialHasManyThroughRelationship

export type FinalRelationship =
  | FinalBelongsToRelationship
  | FinalHasManyRelationship
  | FinalHasOneRelationship
  | FinalHasManyThroughRelationship
