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
  // @ts-expect-error @todo HATCH-417
  | PartialBelongsToRelationship
  // @ts-expect-error @todo HATCH-417
  | PartialHasManyRelationship
  // @ts-expect-error @todo HATCH-417
  | PartialHasOneRelationship
  | PartialHasManyThroughRelationship

export type FinalRelationship =
  | FinalBelongsToRelationship
  | FinalHasManyRelationship
  | FinalHasOneRelationship
  | FinalHasManyThroughRelationship
