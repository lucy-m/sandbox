// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MyReactLib } from '@my-nx-workspace/my-react-lib';
import styles from './app.module.scss';
import NxWelcome from './nx-welcome';

export function App() {
  return (
    <>
      <MyReactLib someNumber={3} />
      <div />
    </>
  );
}

export default App;
