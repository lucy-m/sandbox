import {
  ReadonlySignal,
  Signal,
  batch,
  computed,
  signal,
  useSignal,
} from "@preact/signals";
import { createContext } from "preact";
import { useContext } from "preact/hooks";

interface Todo {
  text: string;
  completed: boolean;
}

interface TodoState {
  todos: ReadonlySignal<Todo[]>;
  completedPercent: ReadonlySignal<string>;

  addTodo: (text: string) => void;
  completeTodo: (todo: Todo) => void;
}

const initialTodoState: TodoState = (() => {
  const todos: Signal<Todo[]> = signal([
    { text: "Pick up glitter", completed: true },
    {
      text: "Buy a coffee",
      completed: false,
    },
    {
      text: "Fall over",
      completed: false,
    },
  ]);

  const completedPercent = computed(() => {
    const completed = todos.value.filter((t) => t.completed).length;
    const total = todos.value.length;

    return ((completed / total) * 100).toFixed(0) + "%";
  });

  const addTodo = (text: string) => {
    [...todos.value, { text, completed: false }];
  };

  const completeTodo = (todo: Todo) => {
    todos.value = todos.value.map((listTodo) => {
      if (listTodo === todo) {
        return { ...todo, completed: true };
      } else {
        return listTodo;
      }
    });
  };

  return { todos, completedPercent, addTodo, completeTodo };
})();

const TodoContext = createContext<TodoState | undefined>(undefined);
const useTodos = (): TodoState => {
  const v = useContext(TodoContext);

  if (!v) {
    throw new Error("TodoContext must be initialised before use");
  }

  return v;
};

const TodoInput = () => {
  const { addTodo } = useTodos();
  const text = useSignal("");

  const onAddClick = () => {
    const trimmed = text.value.trim();

    if (trimmed) {
      batch(() => {
        addTodo(trimmed);
        text.value = "";
      });
    }
  };

  return (
    <div>
      <input
        value={text}
        onInput={(e) => (text.value = (e.target as HTMLInputElement).value)}
        onKeyDown={(k) => {
          if (k.key === "Enter") {
            onAddClick();
          }
        }}
      />
      <button onClick={onAddClick}>Add</button>
    </div>
  );
};

const TodoListViewer = () => {
  const { todos, completedPercent, completeTodo } = useTodos();

  return (
    <>
      <ul>
        {todos.value.map((todo) => (
          <li
            style={{
              textDecoration: todo.completed ? "line-through" : undefined,
              cursor: "pointer",
            }}
            onClick={() => completeTodo(todo)}
          >
            {todo.text}
          </li>
        ))}
      </ul>
      <p>Your day is {completedPercent} complete</p>
    </>
  );
};

export const TodoList = () => {
  return (
    <TodoContext.Provider value={initialTodoState}>
      <div>
        <h1>Things that must be done!</h1>
        <TodoInput />
        <TodoListViewer />
      </div>
    </TodoContext.Provider>
  );
};
