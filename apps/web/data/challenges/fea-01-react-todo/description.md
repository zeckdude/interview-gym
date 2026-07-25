# React Todo List

## What You're Building

Implement the state management logic for a Todo List application — the operations that a React component would call. We test the logic, not the JSX.

## Requirements

Implement `createTodoStore()` that returns a store with:
- `addTodo(text)` — adds a new todo with `{ id, text, completed: false }`
- `toggleTodo(id)` — toggles the `completed` state of a todo
- `removeTodo(id)` — removes a todo by id
- `getTodos()` — returns the current list of todos
- `getCompleted()` — returns only completed todos
- `getPending()` — returns only pending todos
- IDs are unique strings (use `Date.now().toString()` or similar)

## Example

```js
const store = createTodoStore();
store.addTodo('Buy groceries');
store.addTodo('Read book');
store.getTodos().length; // → 2

const [first] = store.getTodos();
store.toggleTodo(first.id);
store.getCompleted().length; // → 1

store.removeTodo(first.id);
store.getTodos().length; // → 1
```

## Why This Comes Up in Interviews

Todo list state management is a classic exercise for React. By separating the logic from the UI, we test the thinking that makes good components: clear state shape, pure operations, and predictable transitions.

## What You Need to Know

- Immutable state updates (don't mutate arrays in place)
- Unique ID generation
- Array filter, map operations
- The distinction between "state" and "derived state"
