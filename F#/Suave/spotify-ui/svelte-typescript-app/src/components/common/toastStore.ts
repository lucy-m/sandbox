import {
  concat,
  concatMap,
  delay,
  filter,
  map,
  of,
  race,
  Subject,
  take,
  tap,
  timer,
} from 'rxjs';
import { subscriberStore } from '../../utils/subscriberStore';

export type ToastState = { message: string; direction: 'in' | 'out' };

const raiseToastSubject = new Subject<string>();
const closeToastSubject = new Subject<void>();

const toast$ = raiseToastSubject.pipe(
  concatMap((message) => {
    const inState = of<ToastState>({ message, direction: 'in' });

    const outState = race(closeToastSubject, timer(3000)).pipe(
      map(() => ({ message, direction: 'out' })),
      take(1)
    );
    const complete = timer(400);

    return concat(inState, outState, complete);
  }),
  filter((val) => val !== 0),
  map((val) => val as ToastState)
);

export const toastStore = () => subscriberStore(toast$);
export const raiseToast = (message: string) => raiseToastSubject.next(message);
export const closeToast = () => closeToastSubject.next();
