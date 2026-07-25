import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface Todo { id: string; text: string; completed: boolean; }
interface TodoStore {
  addTodo(text: string): void;
  toggleTodo(id: string): void;
  removeTodo(id: string): void;
  getTodos(): Todo[];
  getCompleted(): Todo[];
  getPending(): Todo[];
}

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createTodoStore = getExport<() => TodoStore>(exports, 'createTodoStore');

    const store = createTodoStore();
    store.addTodo('Buy groceries');
    store.addTodo('Read book');
    const test1 = store.getTodos().length === 2;

    const first = store.getTodos()[0];
    store.toggleTodo(first.id);
    const test2 = store.getCompleted().length === 1 && store.getPending().length === 1;

    store.removeTodo(first.id);
    const test3 = store.getTodos().length === 1;

    const todos = store.getTodos();
    const test4 = todos[0] && typeof todos[0].id === 'string' && typeof todos[0].text === 'string' && typeof todos[0].completed === 'boolean';

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'addTodo adds items correctly', expected: '2 todos', actual: `${store.getTodos().length + 1} todos (before remove)`, passed: test1 },
        { description: 'toggleTodo marks todo as completed', expected: '1 completed, 1 pending', actual: `${store.getCompleted().length} completed`, passed: test2 },
        { description: 'removeTodo deletes by id', expected: '1 remaining', actual: `${store.getTodos().length} remaining`, passed: test3 },
        { description: 'Todo has { id, text, completed } shape', expected: '{ id: string, text: string, completed: boolean }', actual: test4 ? 'correct shape' : 'wrong shape', passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
