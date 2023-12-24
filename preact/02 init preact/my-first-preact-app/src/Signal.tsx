import { signal } from "@preact/signals";

const count = signal(0);

export const Counter = () => {
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => count.value++}>Increment</button>
    </div>
  );
};
