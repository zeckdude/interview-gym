# Render Props Pattern

## What You're Building

Implement the Render Props pattern — a technique for sharing logic between components by passing a function as a prop that returns UI.

## Requirements

Implement `createDataProvider(fetchFn)` that:
- Returns `{ render(renderProp) }` — calls `renderProp(state)` with loading/data/error state
- Manages loading, success, and error states (same as useFetch)
- The "render prop" is a function that receives `{ data, loading, error }` and returns any value
- `execute(url)` triggers the fetch and re-calls the render prop

## Example

```js
const DataProvider = createDataProvider(fetch);

// In practice, the renderProp returns JSX — here we return strings for testing
DataProvider.render(({ loading, data, error }) => {
  if (loading) return 'Loading...';
  if (error) return 'Error!';
  return \`Got: \${JSON.stringify(data)}\`;
});

await DataProvider.execute('/api/users');
```

## Why This Comes Up in Interviews

Render props was THE React pattern before hooks. Understanding it shows historical React knowledge and architectural thinking. It's the foundation of patterns like React Router's `<Route render={...} />` and Downshift.

## What You Need to Know

- Render props: passing a function as a prop that returns UI
- How render props compare to hooks
- State sharing without HOCs or hooks
- Inversion of control: the consumer controls rendering, the provider controls data
