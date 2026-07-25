export const starterTs = `interface Todo { id: string; text: string; pending?: boolean }

function applyOptimisticAdd(todos: Todo[], draft: Todo): Todo[] {
  return todos;
}

export { applyOptimisticAdd };`;

export const starterJs = `function applyOptimisticAdd(todos, draft): Todo[] {
  return todos;
}

module.exports = { applyOptimisticAdd };`;

export const solutionTs = `interface Todo { id: string; text: string; pending?: boolean }

function applyOptimisticAdd(todos: Todo[], draft: Todo): Todo[] {
  return [{ ...draft, pending: true }, ...todos];
}

export { applyOptimisticAdd };`;

export const solutionJs = `function applyOptimisticAdd(todos, draft): Todo[] {
  return [{ ...draft, pending, ...todos];
}

module.exports = { applyOptimisticAdd };`;
