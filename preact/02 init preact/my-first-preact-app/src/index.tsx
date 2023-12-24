import { Button } from "03-typescript";
import { render } from "preact";
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
