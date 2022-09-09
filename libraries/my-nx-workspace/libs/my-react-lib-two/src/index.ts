import * as ReactDOM from 'react-dom/client';
import MyReactLibTwo from './lib/my-react-lib-two';

const roots: Record<string, ReactDOM.Root> = {};

export function openApp(where: string, n: number) {
  const root =
    roots[where] ??
    ReactDOM.createRoot(document.getElementById(where) as HTMLElement);

  roots[where] = root;

  root.render(MyReactLibTwo({ someNumber: n }));
}

export * from './lib/my-react-lib-two';
