# Using Hatchify in Remix

First, `npx create-remix@latest --template remix-run/remix/templates/vite`

Next:

```
npm i @hatchifyjs/react --save-dev
npm i @hatchifyjs/core --save-dev
npm i @mui/material --save-dev
npm i @hatchifyjs/design-mui --save-dev
```

Next, I created a `app/hatchedReact.ts` like:

```ts
import {
    hatchifyReact,
    createJsonapiClient,
  } from "@hatchifyjs/react"
  
import { belongsTo, boolean, dateonly, integer, hasMany, string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"

export const Todo = {
name: "Todo", // 👀
attributes: {
    name: string({ required: true }), // 👀
    dueDate: dateonly(),
    importance: integer(),
    complete: boolean({ default: false }),
},
relationships: {
    user: belongsTo("User"), // 👀
},
} satisfies PartialSchema

export const User = {
name: "User",
attributes: {
    name: string({ required: true }),
},
relationships: {
    todos: hasMany("Todo"), // 👀
},
} satisfies PartialSchema



const hatchedReact = hatchifyReact(createJsonapiClient("/api", {Todo, User}));
export default hatchedReact;
```

Next, update `app/routes/_index.tsx` to have a todos link:

```tsx
import type { MetaFunction } from "@remix-run/node";
import { Link } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div className="mx-auto mt-16 max-w-7xl text-center">
  <Link
    to="/todos"
    className="text-xl text-blue-600 underline"
  >
    Todos
  </Link>
</div>
    </div>
  );
}
```

Finally, did the following in `app/routes/todos._index.tsx`:

```tsx
import hatchedReact from "~/hatchedReact";

import {
    createTheme,
    ThemeProvider
} from "@mui/material"


import { HatchifyProvider, Pagination} from "@hatchifyjs/react"

const TodoPagination = hatchedReact.components.Todo.Pagination;


export default function Todos() {
    const todoState = {
        minimumLoadTime: 1000,
        }
    const myCustomFilterState = hatchedReact.state.Todo.useDataGridState({
        ...todoState,
        })

    return (
        <ThemeProvider theme={createTheme()}>
            <HatchifyProvider>
            <main>
                <h1>Todos</h1>
                <TodoPagination {...myCustomFilterState}></TodoPagination>
            </main>
            </HatchifyProvider>
        </ThemeProvider>
    );
}
```

Note:

- I wasn't sure exactly where to put the ThemeProvider. I saw https://github.com/mui/material-ui/blob/master/examples/material-ui-remix-ts/app/root.tsx but did not use it
- I didn't want to use `useDataGridState`, but the docs for `Pagination` are basically useless.

