import type {
  FinalBelongsToRelationship,
  PartialBelongsToRelationship,
} from "./belongsTo/types.js"
import type {
  FinalHasManyRelationship,
  PartialHasManyRelationship,
} from "./hasMany/types.js"
import type {
  FinalHasManyThroughRelationship,
  PartialHasManyThroughRelationship,
} from "./hasManyThrough/types.js"
import type {
  FinalHasOneRelationship,
  PartialHasOneRelationship,
} from "./hasOne/types.js"

// @todo HATCH-417
export type PartialRelationship =
  // @ts-expect-error
  | PartialBelongsToRelationship
  // @ts-expect-error
  | PartialHasManyRelationship
  // @ts-expect-error
  | PartialHasOneRelationship
  // @ts-expect-error
  | PartialHasManyThroughRelationship

export type FinalRelationship =
  | FinalBelongsToRelationship
  | FinalHasManyRelationship
  | FinalHasOneRelationship
  | FinalHasManyThroughRelationship
