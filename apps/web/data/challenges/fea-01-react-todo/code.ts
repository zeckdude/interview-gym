export const starterTs = `interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoStore {
  addTodo(text: string): void;
  toggleTodo(id: string): void;
  removeTodo(id: string): void;
  getTodos(): Todo[];
  getCompleted(): Todo[];
  getPending(): Todo[];
}

function createTodoStore(): TodoStore {
  // Implement todo store logic here

  return {
    addTodo(_text) {},
    toggleTodo(_id) {},
    removeTodo(_id) {},
    getTodos() { return []; },
    getCompleted() { return []; },
    getPending() { return []; },
  };
}

export { createTodoStore };`;

export const starterJs = `function createTodoStore() {
  // Implement todo store logic here

  return {
    addTodo(text) {},
    toggleTodo(id) {},
    removeTodo(id) {},
    getTodos() { return []; },
    getCompleted() { return []; },
    getPending() { return []; },
  };
}

module.exports = { createTodoStore };`;

export const solutionTs = `interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

function createTodoStore() {
  let todos: Todo[] = [];
  let nextId = 1;

  return {
    addTodo(text: string) {
      todos = [...todos, { id: String(nextId++), text, completed: false }];
    },
    toggleTodo(id: string) {
      todos = todos.map((t) => t.id === id ? { ...t, completed: !t.completed } : t);
    },
    removeTodo(id: string) {
      todos = todos.filter((t) => t.id !== id);
    },
    getTodos() { return todos; },
    getCompleted() { return todos.filter((t) => t.completed); },
    getPending() { return todos.filter((t) => !t.completed); },
  };
}

export { createTodoStore };`;

export const solutionJs = `function createTodoStore() {
  let todos = [];
  let nextId = 1;

  return {
    addTodo(text) {
      todos = [...todos, { id: String(nextId++), text, completed: false }];
    },
    toggleTodo(id) {
      todos = todos.map((t) => t.id === id ? { ...t, completed: !t.completed } : t);
    },
    removeTodo(id) {
      todos = todos.filter((t) => t.id !== id);
    },
    getTodos() { return todos; },
    getCompleted() { return todos.filter((t) => t.completed); },
    getPending() { return todos.filter((t) => !t.completed); },
  };
}

module.exports = { createTodoStore };`;
