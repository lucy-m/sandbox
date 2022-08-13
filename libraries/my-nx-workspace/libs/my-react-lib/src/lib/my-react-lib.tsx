import styles from './my-react-lib.module.scss';

export interface MyReactLibProps {
  someNumber: number;
}

export function MyReactLib(props: MyReactLibProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to MyReactLib!</h1>
      <h2>The number is {props.someNumber}</h2>
      <p>Hello</p>
    </div>
  );
}

export default MyReactLib;
