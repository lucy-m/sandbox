import styles from './my-react-lib-two.module.scss';

export interface MyReactLibTwoProps {
  someNumber: number;
}

export function MyReactLibTwo(props: MyReactLibTwoProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to MyReactLibTwo!</h1>
      <p>The number is {props.someNumber}</p>
    </div>
  );
}

export default MyReactLibTwo;
