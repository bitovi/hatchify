# Schema Relationships

Hatchify can help you define and build complex relationships between different models within your application. In our previous examples we have used Players and Teams to briefly describe a relationship. Lets take a look at that example again:

```typescript
import { belongsTo, datetime, hasMany, string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"

export const Player: PartialSchema = {
  name: "Player",
  attributes: {
    firstName: string(),
    lastName: string(),
    startDate: datetime(),
    endDate: datetime(),
  },
  relationships: {
    team: belongsTo(),
  },
} satisfies PartialSchema

export const Team: PartialSchema = {
  name: "Team",
  attributes: {
    name: string(),
  },
  relationships: {
    players: hasMany(),
  },
} satisfies PartialSchema
```

We can see that the `Player` has a `belongsTo` property that names `Team` as the target. Similarly, the `Team` contains a `hasMany` property that names `Player` as the target. Given this description we can reason that a Team can have many players and each Player can belong to a single Team.

For another example lets look at `Movies` and `Actors`. Unlike `Players` and `Teams` an Actor CAN be in more than one Movie and a Movie can contain many Actors. How could we describe this sort of relationship?

```typescript
import { belongsTo, string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"

export const Actor: PartialSchema = {
  name: "Actor",
  attributes: {
    name: string(),
  },
  relationships: {
    movies: belongsTo().through(),
  },
} satisfies PartialSchema

export const Movie: PartialSchema = {
  name: "Movie",
  attributes: {
    name: string(),
  },
  relationships: {
    actors: belongsTo().through(),
  },
} satisfies PartialSchema
```

In this scenario, both models have a many-to-many relationship using the `hasMany().through()` association. However, to define this complex relationship, we require an additional table. This table is created using the `through` option, where we specify a through Model named `ActorMovies`, resulting in a table named `actor_movie`.

For more information on these relationships and the options available check these out:

- [Belongs To](./belongs-to.md) 🛑
- [Has Many](./has-many.md) 🛑
- [Has Many Through](./has-many-through.md) 🛑
- [Has One](./has-one.md) 🛑
