## Adding checkboxes to the list

To add a checkboxes column to the list, we must pass an `onSelectedChange` prop to the `TodosList` component. If we want to set the default selected state, we can pass a `defaultSelected` prop as an object with the `ids` of the rows we want to be selected, and an `all` boolean to indicate if the header checkbox should be checked. Whenever a checkbox is clicked, the `onSelectedChange` callback will fire and update our `App` state.

```tsx
// hatchify-app/src/App.tsx
const App: React.FC = () => {
  const [selected, setSelected] = useState<{ all: boolean; ids: string[] }>({
    all: false,
    ids: [],
  })

  return (
    <MuiProvider>
      <button
        onClick={() => alert(`all: ${selected.all}, ids: ${selected.ids}`)}
      >
        action
      </button>
      <TodoList
        defaultSelected={selected} 
        onSelectedChange={(selected) => setSelected(selected)}
      >
        <TodoEmptyList>
          <div>No records to display</div>
        </TodoEmptyList>
      </TodoList>
    </MuiProvider>
  )
}
```
