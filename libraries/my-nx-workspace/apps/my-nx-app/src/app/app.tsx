import { MyReactLib } from '@my-nx-workspace/my-react-lib';
import * as myLib from 'my-react-lib-two';

export function App() {
  const onClick = () => {
    myLib.openApp('foo', 10);
  };

  return (
    <>
      <MyReactLib someNumber={3} />
      <div id="foo" />
      <button onClick={onClick}>mount</button>
    </>
  );
}

export default App;
