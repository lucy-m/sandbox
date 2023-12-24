import { render } from "preact";
import { Button } from "./Button";
import { Counter } from "./Signal";
import { TodoList } from "./TodoList";
import "./style.css";

export function App() {
  return (
    <div>
      <Button />
      <Counter />
      <TodoList />
    </div>
  );
}

render(<App />, document.getElementById("app")!);
